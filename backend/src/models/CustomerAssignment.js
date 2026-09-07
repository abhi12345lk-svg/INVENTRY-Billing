import mongoose from "mongoose";

const customerAssignmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, "Customer ID is required"],
      trim: true,
      index: true
    },
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
      default: "Territory Allocation"
    }
  },
  {
    timestamps: true
  }
);

customerAssignmentSchema.index({ customerId: 1, status: 1 });
customerAssignmentSchema.index({ salesmanId: 1, status: 1 });
customerAssignmentSchema.index({ routeId: 1, status: 1 });

const CustomerAssignment = mongoose.models.CustomerAssignment || mongoose.model("CustomerAssignment", customerAssignmentSchema);

export default CustomerAssignment;
