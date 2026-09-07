export const isAuthorizedToManageVehicles = (user) => {
  if (!user || !user.role) return false;
  return ["SUPER_ADMIN", "ADMIN", "FINANCE", "LOGISTICS"].includes(user.role);
};

export const isAuthorizedToManageTrips = (user) => {
  if (!user || !user.role) return false;
  return ["SUPER_ADMIN", "ADMIN", "FINANCE", "LOGISTICS", "DISPATCH_MANAGER"].includes(user.role);
};

export const validateVehicleData = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Vehicle data is required." };
  }

  if (!data.vehicleNumber || !data.vehicleNumber.trim()) {
    return { valid: false, error: "Vehicle registration number is required (e.g. CG04AB1234)." };
  }

  if (!data.driverName || !data.driverName.trim()) {
    return { valid: false, error: "Primary driver name is required." };
  }

  if (!data.driverMobile || !data.driverMobile.trim()) {
    return { valid: false, error: "Driver mobile contact is required." };
  }

  if (!data.capacity || !data.capacity.trim()) {
    return { valid: false, error: "Vehicle load capacity is required (e.g. 2500 KG)." };
  }

  const validStatuses = ["AVAILABLE", "ON_TRIP", "MAINTENANCE", "INACTIVE"];
  if (data.status && !validStatuses.includes(data.status)) {
    return {
      valid: false,
      error: `Invalid vehicle status. Must be one of: ${validStatuses.join(", ")}`
    };
  }

  return { valid: true };
};

export const validateCreateTrip = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Delivery trip data is required." };
  }

  if (!data.vehicleId || !data.vehicleId.trim()) {
    return { valid: false, error: "A valid vehicle must be selected for the delivery trip." };
  }

  if (!data.driverName || !data.driverName.trim()) {
    return { valid: false, error: "Driver name is required." };
  }

  if (!data.driverMobile || !data.driverMobile.trim()) {
    return { valid: false, error: "Driver contact number is required." };
  }

  if (!data.billIds || !Array.isArray(data.billIds) || data.billIds.length === 0) {
    return { valid: false, error: "At least one customer invoice / bill must be assigned to the trip." };
  }

  return { valid: true };
};

export const validateDeliveryStatusUpdate = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Delivery status payload is required." };
  }

  const validStatuses = ["PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "RETURN_PENDING"];
  if (!data.status || !validStatuses.includes(data.status)) {
    return {
      valid: false,
      error: `Delivery status must be one of: ${validStatuses.join(", ")}`
    };
  }

  return { valid: true };
};
