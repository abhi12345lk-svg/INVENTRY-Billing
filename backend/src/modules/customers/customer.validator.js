import { findCustomerByMobile } from "./customer.repository.js";

export const validateCreateCustomer = async (data) => {
  const errors = [];

  if (!data.shopName || !data.shopName.trim()) {
    errors.push("Shop name is required.");
  }

  if (!data.mobile || !data.mobile.trim()) {
    errors.push("Mobile number is required.");
  } else {
    const cleanMobile = data.mobile.trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      errors.push("Mobile number must be a valid 10-digit number.");
    } else {
      const existing = await findCustomerByMobile(cleanMobile);
      if (existing) {
        errors.push(`A customer with mobile number ${cleanMobile} already exists (${existing.shopName} - ${existing.customerCode}).`);
      }
    }
  }

  if (!data.address || !data.address.trim()) {
    errors.push("Address is required.");
  }

  if (data.creditLimit !== undefined && data.creditLimit !== null) {
    const limit = parseFloat(data.creditLimit);
    if (isNaN(limit) || limit < 0) {
      errors.push("Credit limit cannot be negative.");
    }
  }

  if (data.openingBalance !== undefined && data.openingBalance !== null) {
    const balance = parseFloat(data.openingBalance);
    if (isNaN(balance)) {
      errors.push("Opening balance must be a valid number.");
    }
  }

  if (data.status) {
    const validStatuses = ["ACTIVE", "INACTIVE", "BLOCKED", "ON_HOLD"];
    if (!validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateCustomer = (data) => {
  const errors = [];

  if (data.shopName !== undefined && !data.shopName.trim()) {
    errors.push("Shop name cannot be empty.");
  }

  if (data.mobile !== undefined) {
    const cleanMobile = data.mobile.trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      errors.push("Mobile number must be a valid 10-digit number.");
    }
  }

  if (data.address !== undefined && !data.address.trim()) {
    errors.push("Address cannot be empty.");
  }

  if (data.creditLimit !== undefined) {
    const limit = parseFloat(data.creditLimit);
    if (isNaN(limit) || limit < 0) {
      errors.push("Credit limit cannot be negative.");
    }
  }

  if (data.status) {
    const validStatuses = ["ACTIVE", "INACTIVE", "BLOCKED", "ON_HOLD"];
    if (!validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
