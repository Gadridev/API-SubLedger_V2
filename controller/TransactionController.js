import Subscription from "../model/Subscription.js";
import Transaction from "../model/Transaction.js";
import AppError from "../utils/AppError.js";

export async function createTransaction(req, res, next) {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return next(new AppError("Subscription not found", 404));
    }

    if (subscription.user.toString() !== req.user.id) {
      return next(new AppError("You are not the owner of this subscription", 403));
    }

    if (subscription.status !== "active") {
      return next(new AppError("Subscription is cancelled", 400));
    }

    const transaction = await Transaction.create({
      amount: subscription.price,
      paymentDate: new Date(),
      subscriptionId,
    });

    res.status(201).json({
      status: "success",
      data: {
        transaction,
      },
    });
  } catch (err) {
    next(err);
  }
}
//list all transactions of a subscription
export async function getTransactionsBySubscription(req, res, next) {
  try {
    const subscriptionId = req.params.subscriptionId;
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return next(new AppError("Subscription not found", 404));
    }
    //checking user has subscription or not
    if (subscription.user.toString() !== req.user._id.toString()) {
      return next(new AppError("You are not the owner of this subscription", 401));
    }
    const transactions = await Transaction.find({ subscriptionId }).sort({ paymentDate: -1 });
    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    next(err);
  }
}
//Admin Transactions View of transactions of any user
export async function getAllTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find().populate({
      path: "subscriptionId",
      select: "name price user",
    });
    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    next(err);
  }
}
//Prevent Transaction on Cancelled Subscription
export async function preventTransactionOnCancelledSubscription(req, res, next) {
  try {
    const subscriptionId = req.body.subscriptionId;
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return next(new AppError("Subscription not found", 404));
    }
    if (subscription.status === "cancelled") {
      return next(new AppError("Cannot create transaction for a cancelled subscription", 400));
    }
    next();
  } catch (err) {
    next(err);
  }
}
export async function getTransactionStats(req, res, next) {
  try {
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: "active" });
    const cancelledSubscriptions = await Subscription.countDocuments({ status: "cancelled" });
    const totalSpentAgg = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);
    const totalSpent = totalSpentAgg[0] ? totalSpentAgg[0].totalSpent : 0;
    res.status(200).json({
      status: "success",
      data: {
        totalSubscriptions,
        activeSubscriptions,
        cancelledSubscriptions,
        totalSpent,
      },
    });
  } catch (err) {
    next(err);
  }
}