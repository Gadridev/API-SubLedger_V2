import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("DB connection successful!");
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error("DB :", err.message);
    process.exit(1);
  });