import { findAreaByName } from "./area.repository.js";

const VALID_STATUSES = ["ACTIVE", "INACTIVE"];

export const validateCreateArea = async (data) => {
  const errors = [];

  if (!data.areaName || !data.areaName.trim()) {
    errors.push("Area name is required.");
  } else {
    const existing = await findAreaByName(data.areaName);
    if (existing) {
      errors.push(`An area with name '${data.areaName.trim()}' already exists (${existing.areaCode}).`);
    }
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be either 'ACTIVE' or 'INACTIVE'.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateArea = async (id, data) => {
  const errors = [];

  if (data.areaName !== undefined) {
    if (!data.areaName.trim()) {
      errors.push("Area name cannot be empty.");
    } else {
      const existing = await findAreaByName(data.areaName);
      if (existing && existing.id !== id && existing.areaCode !== id) {
        errors.push(`Another area with name '${data.areaName.trim()}' already exists (${existing.areaCode}).`);
      }
    }
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be either 'ACTIVE' or 'INACTIVE'.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
