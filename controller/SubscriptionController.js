import Subscription from "../model/Subscription.js";
import AppError from "../utils/AppError.js";



export async function createSubscription(req, res, next) {
  try {
    const subscription = await Subscription.create(req.body);

    res.status(201).json({
      status: "success",
      data: subscription,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSubscriptionById(req, res, next) {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return next(new AppError("Subscription not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (err) {
    next(err);
  }
}
export async function updateSubscription(req, res, next) {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
     if (!subscription) {
      return next(new AppError("No subscription found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        subscription,
      },
    });
  } catch (err) {
    next(err)
  }
}

export async function deleteSubscription(req, res, next) {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      return next(new AppError("Subscription not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

