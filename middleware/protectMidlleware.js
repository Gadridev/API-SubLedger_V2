import AppError from "../utils/AppError.js";
import User from "../model/User.js"
import jwt from "jsonwebtoken"
import { promisify } from "util";
export const protect = async (req, res, next) => {
    try{
        let token;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        ) {
          token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
          return next(
            new AppError("You are not logged in! Please log in to get access", 401)
          );
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const CurrentUser = await User.findById(decoded.id);
        if (!CurrentUser) {
          return next(
            new AppError("the user belonging to this token is no longer exist", 401)
          );
        }
        if  (CurrentUser.ChangePasswordAfer(decoded.iat)) {
          return next(
            new AppError("User recently changed password! Please log in again.", 401)
          );
        }
        req.user = CurrentUser;
        res.locals.user = CurrentUser;
        return next();
    } catch (err) {
        next(err);
    }
};