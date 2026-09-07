import mongoose from "mongoose";

const ExceptionSchema = new mongoose.Schema(
  {
    exceptionNumber: {
      type: String,
      required: true,
      unique: true
    },
    exceptionType: {
      type: String,
      required: true,
      enum: [
        "CASH_MISMATCH",
        "UNMATCHED_UPI",
        "LOW_STOCK",
        "OUT_OF_STOCK",
        "OVERDUE_PAYMENT",
        "PENDING_DELIVERY",
        "DELIVERY_FAILED",
        "STOCK_ADJUSTMENT",
        "PAYMENT_CANCELLATION",
        "BILL_AMENDMENT"
      ]
    },
    module: {
      type: String,
      required: true,
      enum: ["PAYMENTS", "INVENTORY", "DELIVERY", "RECEIVABLES", "BILLING", "SALES"]
    },
    severity: {
      type: String,
      required: true,
      enum: ["CRITICAL", "HIGH", "WARNING", "INFO"],
      default: "HIGH"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"],
      default: "OPEN"
    },
    referenceType: {
      type: String
    },
    referenceId: {
      type: String
    },
    referenceNumber: {
      type: String
    },
    customerId: {
      type: String
    },
    customerName: {
      type: String
    },
    salesmanId: {
      type: String
    },
    salesmanName: {
      type: String
    },
    amount: {
      type: Number,
      default: 0
    },
    detectedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date
    },
    resolvedBy: {
      type: String
    },
    resolutionNote: {
      type: String
    },
    auditHistory: [
      {
        action: {
          type: String,
          required: true
        },
        performedBy: {
          type: String,
          required: true
        },
        performedAt: {
          type: Date,
          default: Date.now
        },
        note: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Exception = mongoose.models.Exception || mongoose.model("Exception", ExceptionSchema);
export default Exception;
