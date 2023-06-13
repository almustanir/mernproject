const User = require("../models/User");
const Note = require("../models/Note");

const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { response } = require("express");

//desc Get all users
//routes Get /user
//access private routes

const getAllusers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "User not found" });
  }
  res.json(users);
});

//desc create new users
//routes POST /user
//access private routes

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res
      .status(400)
      .json({ message: "username and password are highly required" });
  }

  //check  for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: "username already exist" });
  }

  //hash the password
  const hashPwd = await bcrypt.hash(password, 10); //sort rounds
  const userObject = {
    username,
    password: hashPwd,
    roles,
  };

  //create and store a user
  const user = await User.create(userObject);
  if (user) {
    //create a new user

    res.status(201).json({ message: `New user:${username} created` });
  } else {
    res.status(400).json({ message: "invalid data user data received" });
  }
});

//desc update a user
//routes PUT/PATCH /user
//access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  //confirm data
  if (!id || !roles.length || typeof active !== "boolean") {
    return res.status(400).json({ message: "all field are required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return response.status(400).json({ message: "user not found" });
  }

  //check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    //Hash the password
    user.password = await bcrypt.hash(password, 10); //sort round
  }

  const updateUser = await user.save();
  res.json({ message: `${updateUser.username}updated successfully` });
});
// desc delete users
// routes DELETE user
// access private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "user ID is required" });
  }

  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes) {
    return res.status(400).json({ message: "user assigned notes" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "user not found " });
  }

  const deletedUser = await user.deleteOne();
  const reply = `username ${deletedUser.username} with ID ${deletedUser._id}
  dalete`;

  res.json(reply);
});

module.exports = { getAllusers, updateUser, createNewUser, deleteUser };
