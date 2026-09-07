import mongoose from "mongoose";

const salesmanSchema = new mongoose.Schema(
  {
    salesmanCode: {
      type: String,
      required: [true, "Salesman code is required"],
      unique: true,
      trim: true,
      index: true
    },
    userId: {
      type: String,
      trim: true,
      default: null,
      index: true
    },
    employeeCode: {
      type: String,
      required: [true, "Employee code is required"],
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Salesman name is required"],
      trim: true
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      index: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    joiningDate: {
      type: String,
      default: () => new Date().toISOString()
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true
    },
    notes: {
      type: String,
      trim: true,
      default: ""
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

salesmanSchema.index({ name: "text", salesmanCode: "text", employeeCode: "text", mobile: "text" });

const Salesman = mongoose.models.Salesman || mongoose.model("Salesman", salesmanSchema);

export default Salesman;
