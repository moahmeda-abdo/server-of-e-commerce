import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.js";
import seedRouter from "./routes/seedRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();

dotenv.config();

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Define CORS options for allowing requests from a specific origin
const corsOptions = {
  origin: [
    "http://localhost:3000" || "https://client-for-ecommerce-ns4i.vercel.app/",
  ],  // You can change this to your client's origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes for various resources
app.use("/api/seed", seedRouter); // For seeding data
app.use("/api/products", productRouter); // For product-related routes
app.use("/api/users", userRouter); // For user-related routes
app.use("/api/orders", orderRouter); // For order-related routes

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
