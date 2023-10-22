import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Handle user sign-in
const handleSignin = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const isMatched = await bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (isMatched) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isViewer: user.isViewer,
        token: generateToken(user),
      });
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

// Handle user sign-up
const handleSignUp = expressAsyncHandler(async (req, res) => {
  const isExist = await User.findOne({ email: req.body.email });
  if (isExist) {
    return res.status(400).json({ error: "User already exists" });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: false,
      isViewer: false,
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isViewer: user.isViewer,
      token: generateToken(user),
    });
  }
});

// Handle fetching all users for admin
const handleUsersForAdmin = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

// Handle deleting a user by ID for admin
const handleDeleteForAdmin = expressAsyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndRemove(req.params.id);

  if (deletedUser) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404).send({ message: "Something went wrong" });
  }
});

export {
  handleSignin,
  handleSignUp,
  handleUsersForAdmin,
  handleDeleteForAdmin,
};
