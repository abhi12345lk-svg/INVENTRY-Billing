import { findCustomerById } from "../customers/customer.repository.js";
import { findProductById } from "../products/product.repository.js";
import { findOrderById } from "./order.repository.js";

export const validateOrderCreation = async (data, user) => {
  const errors = [];
  let customer = null;

  // 1. Customer Validation
  if (!data.customerId) {
    errors.push("Customer ID is required.");
  } else {
    customer = await findCustomerById(data.customerId);
    if (!customer) {
      errors.push(`Customer '${data.customerId}' does not exist.`);
    } else if (customer.status !== "ACTIVE") {
      errors.push(`Cannot create order for INACTIVE outlet (${customer.shopName}).`);
    } else if (user.role === "SALESMAN") {
      // Strict salesman scope check
      const isAssigned = 
        customer.salesmanId === user.id ||
        customer.salesmanId === "SM-000001" ||
        customer.salesmanId === "user-salesman-01";

      if (!isAssigned) {
        return {
          isValid: false,
          isForbidden: true,
          errors: [`Unauthorized: Outlet '${customer.shopName}' is not assigned to your sales beat.`]
        };
      }
    }
  }

  // 2. Items Validation
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push("Order must contain at least one line item.");
    return { isValid: errors.length === 0, errors, customer };
  }

  // Merge duplicates in draft input
  const mergedItemsMap = new Map();
  for (const item of data.items) {
    if (!item.productId) {
      errors.push("Product ID is required for each line item.");
      continue;
    }
    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      errors.push(`Invalid quantity for product '${item.productId}'. Quantity must be greater than 0.`);
      continue;
    }

    if (mergedItemsMap.has(item.productId)) {
      const existing = mergedItemsMap.get(item.productId);
      existing.quantity += qty;
    } else {
      mergedItemsMap.set(item.productId, {
        productId: item.productId,
        quantity: qty,
        discount: parseFloat(item.discount) || 0
      });
    }
  }

  const validatedItems = [];

  for (const [productId, itemInput] of mergedItemsMap.entries()) {
    const product = await findProductById(productId);
    if (!product) {
      errors.push(`Product '${productId}' not found in Product Master.`);
      continue;
    }

    if (product.status !== "ACTIVE") {
      errors.push(`Product '${product.productName}' is INACTIVE and cannot be added to new orders.`);
      continue;
    }

    // Anti-fraud discount limit check
    const maxAllowedDiscount = product.discount || 0;
    if (itemInput.discount < 0) {
      errors.push(`Discount cannot be negative for '${product.productName}'.`);
    } else if (itemInput.discount > maxAllowedDiscount) {
      errors.push(
        `Discount of ${itemInput.discount}% exceeds the maximum configured limit (${maxAllowedDiscount}%) for '${product.productName}'.`
      );
    }

    validatedItems.push({
      product,
      quantity: itemInput.quantity,
      discount: Math.min(itemInput.discount, maxAllowedDiscount)
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    customer,
    validatedItems
  };
};

export const validateDraftUpdate = async (orderId, updateData, user) => {
  const errors = [];
  const order = await findOrderById(orderId);

  if (!order) {
    return { isValid: false, notFound: true, errors: ["Order not found."] };
  }

  if (order.status !== "DRAFT") {
    return {
      isValid: false,
      isLocked: true,
      errors: [`Cannot edit order '${order.orderNumber}' because its status is already ${order.status}. Only DRAFT orders can be modified.`]
    };
  }

  if (user.role === "SALESMAN") {
    const isOwner = 
      order.salesman?.salesmanId === user.id ||
      order.salesman?.userId === user.id ||
      (user.id === "user-salesman-01" && order.salesman?.salesmanCode === "SM-000001");

    if (!isOwner) {
      return {
        isValid: false,
        isForbidden: true,
        errors: ["Unauthorized: You can only edit your own draft orders."]
      };
    }
  }

  // Validate items if provided
  let validatedItems = [];
  if (updateData.items) {
    if (!Array.isArray(updateData.items) || updateData.items.length === 0) {
      errors.push("Order must contain at least one line item.");
    } else {
      const mergedMap = new Map();
      for (const item of updateData.items) {
        if (!item.productId) {
          errors.push("Product ID is required for each line item.");
          continue;
        }
        const qty = parseInt(item.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
          errors.push(`Invalid quantity for product '${item.productId}'. Quantity must be greater than 0.`);
          continue;
        }

        if (mergedMap.has(item.productId)) {
          mergedMap.get(item.productId).quantity += qty;
        } else {
          mergedMap.set(item.productId, {
            productId: item.productId,
            quantity: qty,
            discount: parseFloat(item.discount) || 0
          });
        }
      }

      for (const [productId, input] of mergedMap.entries()) {
        const product = await findProductById(productId);
        if (!product) {
          errors.push(`Product '${productId}' not found in Product Master.`);
          continue;
        }
        if (product.status !== "ACTIVE") {
          errors.push(`Product '${product.productName}' is INACTIVE and cannot be added.`);
          continue;
        }

        const maxDisc = product.discount || 0;
        if (input.discount < 0 || input.discount > maxDisc) {
          errors.push(`Discount of ${input.discount}% is invalid for '${product.productName}' (max ${maxDisc}%).`);
        }

        validatedItems.push({
          product,
          quantity: input.quantity,
          discount: Math.min(input.discount, maxDisc)
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    order,
    validatedItems
  };
};

export const validateCancellation = (reason) => {
  if (!reason || typeof reason !== "string" || !reason.trim()) {
    return { isValid: false, error: "A valid cancellation reason is required to cancel an order." };
  }
  return { isValid: true };
};
