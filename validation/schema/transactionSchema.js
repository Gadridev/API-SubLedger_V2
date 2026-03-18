import Joi from "joi";

export const createTransactionSchema = Joi.object({
  subscriptionId: Joi.string().required().messages({
    "any.required": "Subscription ID is required",
    "string.empty": "Subscription ID cannot be empty",
  }),

  amount: Joi.number().greater(0).optional().messages({
    "number.base": "Amount must be a number",
    "number.greater": "Amount must be greater than 0",
  }),

  paymentDate: Joi.date().optional().messages({
    "date.base": "Payment date must be a valid date",
  }),
});