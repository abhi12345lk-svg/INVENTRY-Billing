import {
  getCustomerHistoryService,
  reassignCustomerService,
  getAssignmentSummaryService
} from "./assignment.service.js";
import { findCustomers } from "../customers/customer.repository.js";

export const getCustomerAssignmentsList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      areaId = "ALL",
      routeId = "ALL",
      salesmanId = "ALL",
      unassignedOnly = "false"
    } = req.query;

    const result = await findCustomers({
      page,
      limit,
      search,
      areaId: areaId === "ALL" ? "" : areaId,
      routeId: routeId === "ALL" ? "" : routeId,
      salesmanId: salesmanId === "ALL" ? "" : salesmanId,
      unassignedOnly: unassignedOnly === "true",
      scopedSalesmanId: req.user.role === "SALESMAN" ? req.user.id : null
    });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch customer assignments."
    });
  }
};

export const getCustomerAssignmentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await getCustomerHistoryService(id, req.user);
    return res.status(200).json({
      success: true,
      customerId: id,
      count: history.length,
      data: history,
      history
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch customer assignment history."
    });
  }
};

export const reassignCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { salesmanId, routeId, areaId, reason } = req.body;

    const result = await reassignCustomerService(
      { customerId: id, salesmanId, routeId, areaId, reason },
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Customer assignment successfully updated.",
      ...result
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update customer assignment."
    });
  }
};

export const getAssignmentSummary = async (req, res) => {
  try {
    const summary = await getAssignmentSummaryService(req.user);
    return res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch assignment summary."
    });
  }
};
