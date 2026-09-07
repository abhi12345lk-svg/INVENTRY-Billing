import mongoose from "mongoose";

const ApprovalRequestSchema = new mongoose.Schema(
  {
    approvalNumber: {
      type: String,
      required: true,
      unique: true
    },
    approvalType: {
      type: String,
      required: true,
      enum: [
        "BILL_AMENDMENT",
        "PAYMENT_CANCELLATION",
        "STOCK_ADJUSTMENT",
        "CUSTOMER_CREDIT_OVERRIDE"
      ]
    },
    module: {
      type: String,
      required: true,
      enum: ["BILLING", "PAYMENTS", "INVENTORY", "RECEIVABLES", "SALES"]
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
    requestedBy: {
      type: String,
      required: true
    },
    requestedByName: {
      type: String,
      required: true
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
    currentData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    requestedChanges: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING"
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: {
      type: Date
    },
    reviewedBy: {
      type: String
    },
    reviewerName: {
      type: String
    },
    decisionNote: {
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

const ApprovalRequest = mongoose.models.ApprovalRequest || mongoose.model("ApprovalRequest", ApprovalRequestSchema);
export default ApprovalRequest;
