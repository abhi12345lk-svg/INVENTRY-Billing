import {
  getCustomersService,
  getCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  updateCustomerStatusService
} from "./customer.service.js";

export const getCustomers = async (req, res) => {
  try {
    const result = await getCustomersService(req.query, req.user);
    return res.status(200).json({
      success: true,
      message: "Customers retrieved successfully.",
      ...result
    });
  } catch (error) {
    console.error("Get customers controller error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch customers."
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(id, req.user);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }
    return res.status(200).json({
      success: true,
      customer
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Error retrieving customer details."
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await createCustomerService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Customer ${newCustomer.shopName} (${newCustomer.customerCode}) created successfully.`,
      customer: newCustomer
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create customer."
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateCustomerService(id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Customer ${updated.customerCode} updated successfully.`,
      customer: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update customer."
    });
  }
};

export const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required."
      });
    }
    const updated = await updateCustomerStatusService(id, status, reason, req.user);
    return res.status(200).json({
      success: true,
      message: `Customer ${updated.customerCode} status changed to ${updated.status}.`,
      customer: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to change customer status."
    });
  }
};
