import express from "express";

import { createorder, getOrders, updateOrderstatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createorder);

orderRouter.get("/", getOrders);

orderRouter.put("/:orderID", updateOrderstatus);

export default orderRouter;