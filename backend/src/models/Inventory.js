import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    inventoryCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    productId: {
      type: String,
      required: true,
      index: true
    },
    productCode: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      trim: true
    },
    companyId: {
      type: String,
      required: true,
      index: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    unit: {
      type: String,
      default: "PCS"
    },
    packSize: {
      type: String,
      default: ""
    },
    mrp: {
      type: Number,
      default: 0
    },
    saleRate: {
      type: Number,
      default: 0
    },
    purchaseRate: {
      type: Number,
      default: 0
    },
    openingStock: {
      type: Number,
      default: 0,
      min: [0, "Opening stock cannot be negative"]
    },
    currentStock: {
      type: Number,
      default: 0,
      min: [0, "Current stock cannot be negative"]
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: [0, "Reserved stock cannot be negative"]
    },
    availableStock: {
      type: Number,
      default: 0
    },
    minimumStock: {
      type: Number,
      default: 10,
      min: [0, "Minimum stock cannot be negative"]
    },
    status: {
      type: String,
      enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
      default: "IN_STOCK",
      index: true
    },
    location: {
      type: String,
      default: "Warehouse Central (Raipur)"
    },
    lastMovementAt: {
      type: Date,
      default: Date.now
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

// Calculate availableStock and status before save
inventorySchema.pre("save", function (next) {
  this.availableStock = Math.max(0, (this.currentStock || 0) - (this.reservedStock || 0));

  if (this.currentStock <= 0) {
    this.status = "OUT_OF_STOCK";
  } else if (this.currentStock <= this.minimumStock) {
    this.status = "LOW_STOCK";
  } else {
    this.status = "IN_STOCK";
  }
  next();
});

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
