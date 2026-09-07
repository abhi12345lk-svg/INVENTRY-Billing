import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    areaCode: {
      type: String,
      required: [true, "Area code is required"],
      unique: true,
      trim: true,
      index: true
    },
    areaName: {
      type: String,
      required: [true, "Area name is required"],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
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

areaSchema.index({ areaName: "text", areaCode: "text" });

const Area = mongoose.models.Area || mongoose.model("Area", areaSchema);

export default Area;
