import Joi from "joi";
// Password pattern: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const userBaseSchema = {
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "user").default("user"),
};

export const userCreateSchema = Joi.object({
  ...userBaseSchema,
  password: Joi.string().pattern(PASSWORD_PATTERN).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
    "string.empty": "Password is required",
  }),
});
export const userUpdateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().pattern(PASSWORD_PATTERN).messages({
    "string.pattern.base":
      "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
    "string.empty": "Password is required",
  }),
}).min(1);

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
