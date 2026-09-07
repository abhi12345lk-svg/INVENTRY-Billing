import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleCode: {
      type: String,
      required: [true, "Vehicle code is required"],
      unique: true,
      trim: true,
      index: true
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle registration number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["Mini Truck", "Delivery Van", "Truck", "Three Wheeler Cargo", "Other"],
      default: "Mini Truck"
    },
    capacity: {
      type: String,
      required: [true, "Vehicle load capacity is required"],
      default: "2500 KG"
    },
    driverName: {
      type: String,
      required: [true, "Primary driver name is required"],
      trim: true
    },
    driverMobile: {
      type: String,
      required: [true, "Driver mobile contact is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "ON_TRIP", "MAINTENANCE", "INACTIVE"],
      default: "AVAILABLE",
      index: true
    },
    currentTripId: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: ""
    },
    createdBy: {
      type: String,
      default: "Rajesh Sharma (Owner)"
    },
    updatedBy: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
