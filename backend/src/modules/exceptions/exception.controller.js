import { exceptionService } from "./exception.service.js";

export const exceptionController = {
  async resetDemoData(req, res) {
    try {
      const data = exceptionService.resetData();
      return res.status(200).json({
        success: true,
        message: "Demo exceptions and approvals reset successfully",
        data
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  async getExceptions(req, res) {
    try {
      const { search, severity, status, module, page, limit } = req.query;
      const data = await exceptionService.getExceptions({ search, severity, status, module, page, limit });
      return res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      console.error("Error fetching exceptions:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch exceptions"
      });
    }
  },

  async getSummary(req, res) {
    try {
      const summary = await exceptionService.getSummary();
      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err) {
      console.error("Error fetching exception summary:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch exception summary"
      });
    }
  },

  async getExceptionById(req, res) {
    try {
      const exception = await exceptionService.getExceptionDetails(req.params.id);
      return res.status(200).json({
        success: true,
        data: exception
      });
    } catch (err) {
      console.error("Error fetching exception details:", err);
      const statusCode = err.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: err.message
      });
    }
  },

  async updateStatus(req, res) {
    try {
      const { status, resolutionNote } = req.body;
      const updated = await exceptionService.updateExceptionStatus(req.params.id, {
        status,
        resolutionNote,
        user: req.user
      });
      return res.status(200).json({
        success: true,
        message: `Exception status updated to ${status}`,
        data: updated
      });
    } catch (err) {
      console.error("Error updating exception status:", err);
      const statusCode = err.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: err.message
      });
    }
  },

  // Approvals endpoints
  async getApprovals(req, res) {
    try {
      const { status, type, module, page, limit } = req.query;
      const data = await exceptionService.getApprovals({ status, type, module, page, limit });
      return res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      console.error("Error fetching approvals:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch approvals"
      });
    }
  },

  async getApprovalSummary(req, res) {
    try {
      const summary = await exceptionService.getApprovalSummary();
      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err) {
      console.error("Error fetching approval summary:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch approval summary"
      });
    }
  },

  async getApprovalById(req, res) {
    try {
      const approval = await exceptionService.getApprovalDetails(req.params.id);
      return res.status(200).json({
        success: true,
        data: approval
      });
    } catch (err) {
      console.error("Error fetching approval details:", err);
      const statusCode = err.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: err.message
      });
    }
  },

  async approveApproval(req, res) {
    try {
      const { decisionNote } = req.body;
      const updated = await exceptionService.processApprovalDecision(req.params.id, {
        action: "APPROVED",
        decisionNote,
        user: req.user
      });
      return res.status(200).json({
        success: true,
        message: "Approval request approved successfully.",
        data: updated
      });
    } catch (err) {
      console.error("Error approving request:", err);
      const statusCode = err.message.includes("not found")
        ? 404
        : err.message.includes("already")
        ? 400
        : 500;
      return res.status(statusCode).json({
        success: false,
        message: err.message
      });
    }
  },

  async rejectApproval(req, res) {
    try {
      const { decisionNote } = req.body;
      const updated = await exceptionService.processApprovalDecision(req.params.id, {
        action: "REJECTED",
        decisionNote,
        user: req.user
      });
      return res.status(200).json({
        success: true,
        message: "Approval request rejected.",
        data: updated
      });
    } catch (err) {
      console.error("Error rejecting request:", err);
      const statusCode = err.message.includes("not found")
        ? 404
        : err.message.includes("already")
        ? 400
        : 500;
      return res.status(statusCode).json({
        success: false,
        message: err.message
      });
    }
  }
};
