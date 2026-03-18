import jwt from "jsonwebtoken";
import User from "../model/User.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    }, 
  });
};
export const singup = async (req, res,next) => {
  try {
     const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUSer = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });
    createSendToken(newUSer, 200, req, res);
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new AppError("please provide a valid email and password", 404),
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("incorrect email or password", 400));
    }
    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
};

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
export const updateUser = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }
    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    updatedUser.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });

  } catch (err) {
    next(err);
  }
};
