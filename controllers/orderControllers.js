import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const handleOrders = expressAsyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;
  const _id = req.user;

  const newOrder = new Order({
    orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
    shippingAddress: shippingAddress,
    paymentMethod: paymentMethod,
    itemsPrice: itemsPrice,
    shippingPrice: shippingPrice,
    taxPrice: taxPrice,
    totalPrice: totalPrice,
    user: _id,
  });
  const order = await newOrder.save();
  res.status(201).send({ message: "New Order Created", order });
});

const handleIdOrders = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});

const handleUserOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

const handleSummary = expressAsyncHandler(async (req, res) => {

  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);
  const summaryData = {
    orders,
    users,
    dailyOrders,
    productCategories,
  };

  res.send(summaryData);
});


const handleOrdersForAdmin = expressAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  try {
    const orders = await Order.find()
      .populate("user", "name")
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalOrders = await Order.countDocuments();

    res.json({
      orders,
      page,
      pages: Math.ceil(totalOrders / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export {
  handleOrders,
  handleIdOrders,
  handleUserOrders,
  handleSummary,
  handleOrdersForAdmin,
};