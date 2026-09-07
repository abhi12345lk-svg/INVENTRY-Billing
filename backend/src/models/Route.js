import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeCode: {
      type: String,
      required: [true, "Route code is required"],
      unique: true,
      trim: true,
      index: true
    },
    routeName: {
      type: String,
      required: [true, "Route name is required"],
      trim: true
    },
    areaId: {
      type: String,
      required: [true, "Area ID is required"],
      trim: true,
      index: true
    },
    areaName: {
      type: String,
      required: [true, "Area name is required"],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    visitDays: {
      type: [String],
      default: ["Monday", "Wednesday", "Friday"]
    },
    sequence: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true
    },
    createdBy: {
      type: String,
      default: "system"
    },
    updatedBy: {
      type: String,
      default: "system"
    }
  },
  {
    timestamps: true
  }
);

routeSchema.index({ areaId: 1, status: 1 });
routeSchema.index({ routeName: "text", routeCode: "text" });

const Route = mongoose.models.Route || mongoose.model("Route", routeSchema);

export default Route;
