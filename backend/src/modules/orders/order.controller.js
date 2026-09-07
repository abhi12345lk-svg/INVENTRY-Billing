import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  updateDraftOrderService,
  submitOrderService,
  cancelOrderService,
  getCustomerOrdersService
} from "./order.service.js";

export const createOrder = async (req, res) => {
  try {
    const newOrder = await createOrderService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Order '${newOrder.orderNumber}' created successfully as ${newOrder.status}.`,
      data: newOrder
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create order."
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "ALL",
      salesmanId = "",
      customerId = "",
      routeId = "",
      areaId = "",
      startDate = "",
      endDate = ""
    } = req.query;

    const result = await getOrdersService(
      {
        page,
        limit,
        search,
        status,
        salesmanId,
        customerId,
        routeId,
        areaId,
        startDate,
        endDate
      },
      req.user
    );

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to retrieve orders."
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "ALL",
      startDate = "",
      endDate = ""
    } = req.query;

    const result = await getOrdersService(
      {
        page,
        limit,
        search,
        status,
        salesmanId: req.user.id,
        startDate,
        endDate
      },
      req.user
    );

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to retrieve your orders."
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id, req.user);
    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to retrieve order."
    });
  }
};

export const updateDraftOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await updateDraftOrderService(id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Draft order '${updatedOrder.orderNumber}' updated successfully.`,
      data: updatedOrder
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update draft order."
    });
  }
};

export const submitOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const submittedOrder = await submitOrderService(id, req.user);
    return res.status(200).json({
      success: true,
      message: `Order '${submittedOrder.orderNumber}' finalized and submitted successfully.`,
      data: submittedOrder
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to submit order."
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const cancelledOrder = await cancelOrderService(id, reason, req.user);
    return res.status(200).json({
      success: true,
      message: `Order '${cancelledOrder.orderNumber}' has been cancelled.`,
      data: cancelledOrder
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to cancel order."
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await getCustomerOrdersService(id, req.user);
    return res.status(200).json({
      success: true,
      customerId: id,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to retrieve customer orders."
    });
  }
};
