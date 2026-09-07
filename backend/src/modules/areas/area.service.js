import {
  findAreas,
  findAreaById,
  createAreaRecord,
  updateAreaRecord,
  updateAreaStatusRecord
} from "./area.repository.js";
import { validateCreateArea, validateUpdateArea } from "./area.validator.js";

export const getAreasService = async (queryParams, user) => {
  return await findAreas(queryParams);
};

export const getAreaByIdService = async (id, user) => {
  return await findAreaById(id);
};

export const createAreaService = async (areaData, user) => {
  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to create areas." };
  }

  const validation = await validateCreateArea(areaData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const newArea = await createAreaRecord({
    ...areaData,
    createdBy: user.name || user.email || user.id
  });

  console.log(`[AUDIT] Area Created: ${newArea.areaCode} (${newArea.areaName}) by ${user.name} [${user.role}]`);

  return newArea;
};

export const updateAreaService = async (id, updateData, user) => {
  const existing = await findAreaById(id);
  if (!existing) {
    throw { status: 404, message: "Area not found." };
  }

  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to edit areas." };
  }

  const validation = await validateUpdateArea(id, updateData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const updated = await updateAreaRecord(id, {
    ...updateData,
    updatedBy: user.name || user.email || user.id
  });

  console.log(`[AUDIT] Area Updated: ${updated.areaCode} (${updated.areaName}) by ${user.name} [${user.role}]`);

  return updated;
};

export const updateAreaStatusService = async (id, status, user) => {
  const existing = await findAreaById(id);
  if (!existing) {
    throw { status: 404, message: "Area not found." };
  }

  if (!["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"].includes(user.role)) {
    throw { status: 403, message: "Forbidden: You do not have permission to change area status." };
  }

  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    throw { status: 400, message: "Status must be either 'ACTIVE' or 'INACTIVE'." };
  }

  const updated = await updateAreaStatusRecord(
    id,
    status,
    user.name || user.email || user.id
  );

  console.log(`[AUDIT] Area Status Changed: ${updated.areaCode} (${updated.areaName}) to ${status} by ${user.name} [${user.role}]`);

  return updated;
};
