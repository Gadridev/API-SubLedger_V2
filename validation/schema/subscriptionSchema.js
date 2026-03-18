import Joi from "joi";

export const createSubscriptionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  price: Joi.number().min(0).required(),

  billingCycle: Joi.string()
    .valid("monthly", "yearly")
    .required(),

  startDate: Joi.date().required(),

  status: Joi.string()
    .valid("active", "cancelled", "expired")
    .optional(),

  user: Joi.string().hex().length(24),
});

export const updateSubscriptionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  price: Joi.number().min(0),

  billingCycle: Joi.string()
    .valid("monthly", "yearly"),

  startDate: Joi.date(),

  status: Joi.string()
    .valid("active", "cancelled", "expired"),
}).min(1);