import {
  findSchemes,
  findSchemeById,
  createSchemeRecord,
  updateSchemeRecord,
  toggleSchemeStatusRecord,
  deleteSchemeRecord
} from "./scheme.repository.js";

export const getSchemesService = async (query = {}) => {
  return await findSchemes(query);
};

export const getSchemeByIdService = async (id) => {
  const scheme = await findSchemeById(id);
  if (!scheme) {
    throw { status: 404, message: `Scheme '${id}' not found.` };
  }
  return scheme;
};

export const createSchemeService = async (data, user) => {
  if (!data.schemeName || !data.schemeName.trim()) {
    throw { status: 400, message: "Scheme name is required." };
  }
  return await createSchemeRecord(data, user);
};

export const updateSchemeService = async (id, data, user) => {
  const existing = await findSchemeById(id);
  if (!existing) {
    throw { status: 404, message: `Scheme '${id}' not found.` };
  }
  return await updateSchemeRecord(id, data, user);
};

export const toggleSchemeStatusService = async (id, user) => {
  const updated = await toggleSchemeStatusRecord(id, user);
  if (!updated) {
    throw { status: 404, message: `Scheme '${id}' not found.` };
  }
  return updated;
};

export const deleteSchemeService = async (id) => {
  const deleted = await deleteSchemeRecord(id);
  if (!deleted) {
    throw { status: 404, message: `Scheme '${id}' not found.` };
  }
  return { success: true, message: "Scheme deleted successfully." };
};
