import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      required: [true, "Customer code is required"],
      unique: true,
      trim: true,
      index: true
    },
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true
    },
    ownerName: {
      type: String,
      trim: true,
      default: ""
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      index: true
    },
    alternateMobile: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true
    },
    areaId: {
      type: String,
      default: "AREA-01"
    },
    areaName: {
      type: String,
      default: "Raipur Central"
    },
    routeId: {
      type: String,
      default: "ROUTE-A",
      index: true
    },
    routeName: {
      type: String,
      default: "Route A - Main Market"
    },
    salesmanId: {
      type: String,
      default: "user-salesman-01",
      index: true
    },
    salesmanName: {
      type: String,
      default: "Rahul Kumar"
    },
    creditLimit: {
      type: Number,
      default: 50000,
      min: [0, "Credit limit cannot be negative"]
    },
    openingBalance: {
      type: Number,
      default: 0
    },
    paymentTerms: {
      type: String,
      default: "Net 15 Days"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED", "ON_HOLD"],
      default: "ACTIVE",
      index: true
    },
    statusReason: {
      type: String,
      default: ""
    },
    notes: {
      type: String,
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

// Compound indexes for query performance
customerSchema.index({ salesmanId: 1, status: 1 });
customerSchema.index({ routeId: 1, status: 1 });
customerSchema.index({ shopName: "text", ownerName: "text", customerCode: "text", mobile: "text" });

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
