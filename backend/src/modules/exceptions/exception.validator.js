export const validateExceptionStatusChange = (req, res, next) => {
  const { status, resolutionNote } = req.body;
  const validStatuses = ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`
    });
  }

  if (status === "RESOLVED" && (!resolutionNote || !resolutionNote.trim())) {
    return res.status(400).json({
      success: false,
      message: "A detailed resolutionNote is required when marking an exception as RESOLVED."
    });
  }

  next();
};

export const validateApprovalDecision = (req, res, next) => {
  const { decisionNote } = req.body;

  if (!decisionNote || !decisionNote.trim()) {
    return res.status(400).json({
      success: false,
      message: "A decisionNote is required for auditing approval decisions."
    });
  }

  next();
};

export const requireOwnerApprovalRole = (req, res, next) => {
  if (!req.user || req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Only SUPER_ADMIN (Owner) has authorization to approve or reject financial amendments."
    });
  }
  next();
};

export const requireExceptionResolutionRole = (req, res, next) => {
  if (!req.user || (req.user.role !== "SUPER_ADMIN" && req.user.role !== "FINANCE" && req.user.role !== "ADMIN")) {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Salesmen and unauthorized staff cannot resolve owner-level business exceptions."
    });
  }
  next();
};
