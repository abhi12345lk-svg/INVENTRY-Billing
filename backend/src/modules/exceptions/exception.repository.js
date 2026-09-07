import Exception from "../../models/Exception.js";
import ApprovalRequest from "../../models/ApprovalRequest.js";

// Operational Exception & Approval Storage (Clean Production Foundation)
let exceptionSeq = 0;
let approvalSeq = 0;

function getInitialExceptions() {
  return [];
}

function getInitialApprovals() {
  return [];
}

// In-memory operational store
let exceptionsMemory = [];
let approvalsMemory = [];

export const exceptionRepository = {
  async createException(data) {
    exceptionSeq += 1;
    const newExc = {
      id: `exc-${Date.now()}-${exceptionSeq}`,
      _id: `exc-${Date.now()}-${exceptionSeq}`,
      exceptionNumber: `EXC-${new Date().getFullYear()}-${String(exceptionSeq).padStart(5, "0")}`,
      exceptionType: data.exceptionType || "GENERAL",
      module: data.module || "SYSTEM",
      severity: data.severity || "WARNING",
      title: data.title || "System Exception",
      description: data.description || "",
      status: data.status || "OPEN",
      referenceType: data.referenceType || null,
      referenceId: data.referenceId || null,
      referenceNumber: data.referenceNumber || null,
      customerName: data.customerName || null,
      amount: data.amount || 0,
      detectedAt: new Date(),
      auditHistory: [
        {
          action: "EXCEPTION_CREATED",
          performedBy: data.performedBy || "System",
          performedAt: new Date(),
          note: data.note || "Operational exception detected."
        }
      ]
    };
    exceptionsMemory.unshift(newExc);
    return newExc;
  },

  async createApproval(data) {
    approvalSeq += 1;
    const newApr = {
      id: `apr-${Date.now()}-${approvalSeq}`,
      _id: `apr-${Date.now()}-${approvalSeq}`,
      approvalNumber: `APR-${new Date().getFullYear()}-${String(approvalSeq).padStart(5, "0")}`,
      approvalType: data.approvalType || "GENERAL",
      module: data.module || "SYSTEM",
      title: data.title || "Approval Request",
      description: data.description || "",
      requestedBy: data.requestedBy || "system",
      requestedByName: data.requestedByName || "System User",
      referenceType: data.referenceType || null,
      referenceId: data.referenceId || null,
      referenceNumber: data.referenceNumber || null,
      currentData: data.currentData || {},
      requestedChanges: data.requestedChanges || {},
      reason: data.reason || "",
      status: "PENDING",
      requestedAt: new Date(),
      auditHistory: [
        {
          action: "APPROVAL_REQUESTED",
          performedBy: data.requestedByName || "System User",
          performedAt: new Date(),
          note: data.reason || "Approval request submitted."
        }
      ]
    };
    approvalsMemory.unshift(newApr);
    return newApr;
  },

  resetDemoData() {
    exceptionsMemory = getInitialExceptions();
    approvalsMemory = getInitialApprovals();
    return {
      exceptionsCount: exceptionsMemory.length,
      approvalsCount: approvalsMemory.length
    };
  },

  // Query exceptions with search, severity, status, module, pagination
  async findExceptions({ search, severity, status, module, page = 1, limit = 50 }) {
    let list = [...exceptionsMemory];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.exceptionNumber.toLowerCase().includes(q) ||
          (e.customerName && e.customerName.toLowerCase().includes(q)) ||
          (e.referenceNumber && e.referenceNumber.toLowerCase().includes(q))
      );
    }

    if (severity && severity !== "ALL") {
      list = list.filter((e) => e.severity === severity);
    }

    if (status && status !== "ALL") {
      list = list.filter((e) => e.status === status);
    }

    if (module && module !== "ALL") {
      list = list.filter((e) => e.module === module);
    }

    // Sort order: CRITICAL first, then HIGH, WARNING, INFO; then newest first
    const severityWeight = { CRITICAL: 4, HIGH: 3, WARNING: 2, INFO: 1 };
    list.sort((a, b) => {
      const diff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
      if (diff !== 0) return diff;
      return new Date(b.detectedAt) - new Date(a.detectedAt);
    });

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      exceptions: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  },

  // Summary counts for KPI cards
  async getExceptionSummary() {
    const totalOpen = exceptionsMemory.filter((e) => e.status === "OPEN" || e.status === "UNDER_REVIEW").length;
    const critical = exceptionsMemory.filter(
      (e) => e.severity === "CRITICAL" && (e.status === "OPEN" || e.status === "UNDER_REVIEW")
    ).length;
    const high = exceptionsMemory.filter(
      (e) => e.severity === "HIGH" && (e.status === "OPEN" || e.status === "UNDER_REVIEW")
    ).length;
    const warning = exceptionsMemory.filter(
      (e) => e.severity === "WARNING" && (e.status === "OPEN" || e.status === "UNDER_REVIEW")
    ).length;
    const info = exceptionsMemory.filter(
      (e) => e.severity === "INFO" && (e.status === "OPEN" || e.status === "UNDER_REVIEW")
    ).length;
    const resolvedToday = exceptionsMemory.filter((e) => e.status === "RESOLVED").length;

    return {
      totalOpen,
      critical,
      high,
      warning,
      info,
      resolvedToday
    };
  },

  async findExceptionById(id) {
    const found = exceptionsMemory.find((e) => e.id === id || e._id === id || e.exceptionNumber === id);
    return found || null;
  },

  async updateExceptionStatus(id, { status, resolutionNote, user }) {
    const exc = exceptionsMemory.find((e) => e.id === id || e._id === id || e.exceptionNumber === id);
    if (!exc) return null;

    exc.status = status;
    if (status === "RESOLVED") {
      exc.resolvedAt = new Date();
      exc.resolvedBy = user ? user.name : "Supervisor";
      exc.resolutionNote = resolutionNote || "";
      exc.auditHistory.push({
        action: "EXCEPTION_RESOLVED",
        performedBy: user ? `${user.name} (${user.role})` : "Owner",
        performedAt: new Date(),
        note: resolutionNote || "Marked as resolved."
      });
    } else if (status === "DISMISSED") {
      exc.resolvedAt = new Date();
      exc.resolvedBy = user ? user.name : "Supervisor";
      exc.resolutionNote = resolutionNote || "Dismissed by owner";
      exc.auditHistory.push({
        action: "EXCEPTION_DISMISSED",
        performedBy: user ? `${user.name} (${user.role})` : "Owner",
        performedAt: new Date(),
        note: resolutionNote || "Dismissed by owner."
      });
    } else if (status === "UNDER_REVIEW") {
      exc.auditHistory.push({
        action: "EXCEPTION_REVIEWED",
        performedBy: user ? `${user.name} (${user.role})` : "Owner",
        performedAt: new Date(),
        note: resolutionNote || "Under active investigation."
      });
    }

    return exc;
  },

  // Approvals methods
  async findApprovals({ status, type, module, page = 1, limit = 50 }) {
    let list = [...approvalsMemory];

    if (status && status !== "ALL") {
      list = list.filter((a) => a.status === status);
    }
    if (type && type !== "ALL") {
      list = list.filter((a) => a.approvalType === type);
    }
    if (module && module !== "ALL") {
      list = list.filter((a) => a.module === module);
    }

    list.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      approvals: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  },

  async getApprovalSummary() {
    const pending = approvalsMemory.filter((a) => a.status === "PENDING").length;
    const approvedToday = approvalsMemory.filter((a) => a.status === "APPROVED").length;
    const rejectedToday = approvalsMemory.filter((a) => a.status === "REJECTED").length;

    return {
      pending,
      approvedToday,
      rejectedToday
    };
  },

  async findApprovalById(id) {
    const found = approvalsMemory.find((a) => a.id === id || a._id === id || a.approvalNumber === id);
    return found || null;
  },

  async reviewApproval(id, { action, decisionNote, user }) {
    const item = approvalsMemory.find((a) => a.id === id || a._id === id || a.approvalNumber === id);
    if (!item) return null;

    item.status = action; // "APPROVED" or "REJECTED"
    item.reviewedAt = new Date();
    item.reviewedBy = user ? user.id : "owner-01";
    item.reviewerName = user ? user.name : "Rajesh Sharma (Owner)";
    item.decisionNote = decisionNote || `Decision recorded as ${action}`;

    item.auditHistory.push({
      action: action === "APPROVED" ? "APPROVAL_APPROVED" : "APPROVAL_REJECTED",
      performedBy: user ? `${user.name} (${user.role})` : "Rajesh Sharma (SUPER_ADMIN)",
      performedAt: new Date(),
      note: decisionNote || `Request ${action.toLowerCase()}.`
    });

    return item;
  }
};
