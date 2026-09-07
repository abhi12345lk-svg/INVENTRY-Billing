import mongoose from "mongoose";

const salesmanRouteAssignmentSchema = new mongoose.Schema(
  {
    salesmanId: {
      type: String,
      required: [true, "Salesman ID is required"],
      trim: true,
      index: true
    },
    routeId: {
      type: String,
      required: [true, "Route ID is required"],
      trim: true,
      index: true
    },
    areaId: {
      type: String,
      required: [true, "Area ID is required"],
      trim: true,
      index: true
    },
    effectiveFrom: {
      type: String,
      required: [true, "Effective from timestamp is required"],
      default: () => new Date().toISOString()
    },
    effectiveTo: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true
    },
    assignedBy: {
      type: String,
      required: true,
      default: "system"
    },
    reason: {
      type: String,
      trim: true,
      default: "Regular Beat Schedule"
    }
  },
  {
    timestamps: true
  }
);

salesmanRouteAssignmentSchema.index({ salesmanId: 1, routeId: 1, status: 1 });

const SalesmanRouteAssignment = mongoose.models.SalesmanRouteAssignment || mongoose.model("SalesmanRouteAssignment", salesmanRouteAssignmentSchema);

export default SalesmanRouteAssignment;
