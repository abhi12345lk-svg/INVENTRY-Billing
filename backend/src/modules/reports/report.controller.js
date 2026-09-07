// backend/src/modules/reports/report.controller.js

import { reportService } from "./report.service.js";

export const reportController = {
  async getExecutiveSummary(req, res) {
    try {
      const { dateRange = "today" } = req.query;
      const data = await reportService.getExecutiveSummary(dateRange);
      return res.status(200).json({
        success: true,
        message: "Executive summary retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getExecutiveSummary:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching executive summary."
      });
    }
  },

  async getSalesAnalytics(req, res) {
    try {
      const { dateRange = "today" } = req.query;
      const data = await reportService.getSalesAnalytics(dateRange);
      return res.status(200).json({
        success: true,
        message: "Sales analytics retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getSalesAnalytics:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching sales analytics."
      });
    }
  },

  async getCollectionAnalytics(req, res) {
    try {
      const { dateRange = "today" } = req.query;
      const data = await reportService.getCollectionAnalytics(dateRange);
      return res.status(200).json({
        success: true,
        message: "Collection analytics retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getCollectionAnalytics:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching collection analytics."
      });
    }
  },

  async getOutstandingReport(req, res) {
    try {
      const data = await reportService.getOutstandingReport();
      return res.status(200).json({
        success: true,
        message: "Outstanding receivables report retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getOutstandingReport:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching outstanding report."
      });
    }
  },

  async getTopCustomers(req, res) {
    try {
      const data = await reportService.getTopCustomers();
      return res.status(200).json({
        success: true,
        message: "Top customers report retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getTopCustomers:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching top customers."
      });
    }
  },

  async getTopProducts(req, res) {
    try {
      const data = await reportService.getTopProducts();
      return res.status(200).json({
        success: true,
        message: "Top products report retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getTopProducts:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching top products."
      });
    }
  },

  async getSalesmanPerformance(req, res) {
    try {
      const data = await reportService.getSalesmanPerformance();
      return res.status(200).json({
        success: true,
        message: "Salesman performance report retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getSalesmanPerformance:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching salesman performance."
      });
    }
  },

  async getExceptionSummary(req, res) {
    try {
      const data = await reportService.getExceptionSummary();
      return res.status(200).json({
        success: true,
        message: "Exception summary retrieved successfully.",
        data
      });
    } catch (error) {
      console.error("Error in getExceptionSummary:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching exception summary."
      });
    }
  }
};
