export const validateStockAdjustment = (body = {}, user = {}, currentStock = 0) => {
  const errors = [];

  // 1. RBAC check: Salesmen and unauthorized roles cannot adjust stock
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "FINANCE"];
  if (!user || !allowedRoles.includes(user.role)) {
    return {
      isValid: false,
      isForbidden: true,
      errors: ["Forbidden: You do not have permission to perform stock adjustments. Only Owner, Admin, and Finance may adjust inventory."]
    };
  }

  const { adjustmentType, quantity, reason } = body;

  // 2. Validate adjustmentType
  if (!adjustmentType || !["ADJUSTMENT_IN", "ADJUSTMENT_OUT"].includes(adjustmentType)) {
    errors.push("Invalid adjustment type. Allowed types: ADJUSTMENT_IN, ADJUSTMENT_OUT.");
  }

  // 3. Validate quantity
  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty <= 0) {
    errors.push("Quantity must be a positive whole number greater than 0.");
  }

  // 4. Validate reason
  if (!reason || typeof reason !== "string" || !reason.trim()) {
    errors.push("Reason is mandatory for inventory stock adjustments to preserve audit trail.");
  }

  // 5. Check negative stock prevention for ADJUSTMENT_OUT
  if (adjustmentType === "ADJUSTMENT_OUT" && parsedQty > 0) {
    if (parsedQty > currentStock) {
      errors.push(
        `Insufficient stock for adjustment out. Current stock is ${currentStock} units, cannot reduce by ${parsedQty} units.`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    isForbidden: false,
    errors,
    parsedQuantity: parsedQty
  };
};
