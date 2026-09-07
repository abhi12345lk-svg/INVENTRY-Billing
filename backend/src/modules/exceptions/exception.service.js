import { exceptionRepository } from "./exception.repository.js";

export const exceptionService = {
  resetData() {
    return exceptionRepository.resetDemoData();
  },

  async getExceptions(filters) {
    return await exceptionRepository.findExceptions(filters);
  },

  async getSummary() {
    return await exceptionRepository.getExceptionSummary();
  },

  async getExceptionDetails(id) {
    const exc = await exceptionRepository.findExceptionById(id);
    if (!exc) {
      throw new Error("Exception record not found");
    }
    return exc;
  },

  async updateExceptionStatus(id, { status, resolutionNote, user }) {
    const updated = await exceptionRepository.updateExceptionStatus(id, { status, resolutionNote, user });
    if (!updated) {
      throw new Error("Exception record not found");
    }
    return updated;
  },

  async getApprovals(filters) {
    return await exceptionRepository.findApprovals(filters);
  },

  async getApprovalSummary() {
    return await exceptionRepository.getApprovalSummary();
  },

  async getApprovalDetails(id) {
    const apr = await exceptionRepository.findApprovalById(id);
    if (!apr) {
      throw new Error("Approval request not found");
    }
    return apr;
  },

  async processApprovalDecision(id, { action, decisionNote, user }) {
    const apr = await exceptionRepository.findApprovalById(id);
    if (!apr) {
      throw new Error("Approval request not found");
    }
    if (apr.status !== "PENDING") {
      throw new Error(`Approval request has already been ${apr.status.toLowerCase()}`);
    }

    return await exceptionRepository.reviewApproval(id, { action, decisionNote, user });
  }
};
