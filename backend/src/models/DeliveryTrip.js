import mongoose from "mongoose";

const deliveryItemSchema = new mongoose.Schema(
  {
    billId: {
      type: String,
      required: true,
      trim: true
    },
    billNumber: {
      type: String,
      required: true,
      trim: true
    },
    customerId: {
      type: String,
      required: true,
      trim: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      default: ""
    },
    mobile: {
      type: String,
      default: ""
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "RETURN_PENDING"],
      default: "PENDING",
      index: true
    },
    deliveryTime: {
      type: String,
      default: null
    },
    remarks: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const deliveryTripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      required: [true, "Trip number is required"],
      unique: true,
      trim: true,
      index: true
    },
    tripDate: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
      index: true
    },
    vehicleId: {
      type: String,
      required: [true, "Vehicle ID is required"],
      index: true
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle registration number is required"],
      index: true
    },
    driverName: {
      type: String,
      required: [true, "Driver name is required"]
    },
    driverMobile: {
      type: String,
      required: [true, "Driver mobile number is required"]
    },
    routeId: {
      type: String,
      default: ""
    },
    routeName: {
      type: String,
      default: ""
    },
    salesmanId: {
      type: String,
      default: ""
    },
    salesmanName: {
      type: String,
      default: ""
    },
    billIds: {
      type: [String],
      required: true,
      validate: [
        (ids) => ids && ids.length > 0,
        "Trip must contain at least one bill."
      ]
    },
    deliveries: {
      type: [deliveryItemSchema],
      required: true
    },
    totalBills: {
      type: Number,
      required: true,
      default: 0
    },
    deliveredBills: {
      type: Number,
      default: 0
    },
    pendingBills: {
      type: Number,
      default: 0
    },
    failedBills: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["PLANNED", "READY", "DISPATCHED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "READY",
      index: true
    },
    dispatchTime: {
      type: String,
      default: null
    },
    returnTime: {
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

// Pre-save hook to maintain totals
deliveryTripSchema.pre("save", function () {
  if (this.deliveries && Array.isArray(this.deliveries)) {
    this.totalBills = this.deliveries.length;
    this.deliveredBills = this.deliveries.filter((d) => d.status === "DELIVERED").length;
    this.failedBills = this.deliveries.filter((d) => d.status === "FAILED" || d.status === "RETURN_PENDING").length;
    this.pendingBills = this.totalBills - this.deliveredBills - this.failedBills;
    this.totalAmount = this.deliveries.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }
});

const DeliveryTrip = mongoose.models.DeliveryTrip || mongoose.model("DeliveryTrip", deliveryTripSchema);

export default DeliveryTrip;
