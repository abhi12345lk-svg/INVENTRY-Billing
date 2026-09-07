// backend/src/modules/reports/report.service.js

import { reportRepository } from "./report.repository.js";

export const reportService = {
  async getExecutiveSummary(dateRange) {
    return await reportRepository.getExecutiveSummary(dateRange);
  },

  async getSalesAnalytics(dateRange) {
    return await reportRepository.getSalesAnalytics(dateRange);
  },

  async getCollectionAnalytics(dateRange) {
    return await reportRepository.getCollectionAnalytics(dateRange);
  },

  async getOutstandingReport() {
    return await reportRepository.getOutstandingReport();
  },

  async getTopCustomers() {
    return await reportRepository.getTopCustomers();
  },

  async getTopProducts() {
    return await reportRepository.getTopProducts();
  },

  async getSalesmanPerformance() {
    return await reportRepository.getSalesmanPerformance();
  },

  async getExceptionSummary() {
    return await reportRepository.getExceptionSummary();
  }
};
