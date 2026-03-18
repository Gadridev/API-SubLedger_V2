import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [1, "Amount must be greater than 0"],
    },

    paymentDate: {
      type: Date,
      required: [true, "Payment date is required"],
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: [true, "Transaction must belong to a subscription"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;