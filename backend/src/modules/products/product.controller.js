import {
  getProductsService,
  getActiveProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  updateProductStatusService
} from "./product.service.js";

export const getProducts = async (req, res) => {
  try {
    const result = await getProductsService(req.query, req.user);
    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      ...result
    });
  } catch (error) {
    console.error("Get products controller error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch products."
    });
  }
};

export const getActiveProducts = async (req, res) => {
  try {
    const products = await getActiveProductsService(req.user);
    return res.status(200).json({
      success: true,
      message: "Active products retrieved successfully for order creation.",
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Get active products controller error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch active products."
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id, req.user);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }
    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Error retrieving product details."
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await createProductService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Product '${newProduct.productName}' (${newProduct.productCode}) created successfully.`,
      product: newProduct
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create product."
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateProductService(id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Product ${updated.productCode} updated successfully.`,
      product: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update product."
    });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required ('ACTIVE' or 'INACTIVE')."
      });
    }
    const updated = await updateProductStatusService(id, status, req.user);
    return res.status(200).json({
      success: true,
      message: `Product ${updated.productCode} status changed to ${updated.status}.`,
      product: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to change product status."
    });
  }
};
