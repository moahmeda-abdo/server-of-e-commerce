import express from "express"
import { isAdmin, isAuth, isViewer } from "../utils/isAuth.js"
import {
  handleIdOrders,
  handleOrders,
  handleOrdersForAdmin,
  handleSummary,
  handleUserOrders,
} from "../controllers/orderControllers.js";

const orderRouter = express();

orderRouter.post("/", isAuth, handleOrders);
orderRouter.get("/summary", isAuth, isViewer, handleSummary);
orderRouter.get("/ordersList", isAuth, isViewer, handleOrdersForAdmin);
orderRouter.get("/orderhistory",isAuth,  handleUserOrders);
orderRouter.get("/:id",isAuth, handleIdOrders);
export default orderRouter