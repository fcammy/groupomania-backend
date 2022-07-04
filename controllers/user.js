import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../prisma/db.js";
import dotenv from "dotenv";

dotenv.config();

// User Registration

export const register = async (req, res, next) => {
  try {
    const { email, password, image } = req.body;

    if (!email || !password) throw Error("Email and password are required");

    const user = await db.user.findFirst({
      where: { email: req.body.email },
    });

    if (user) throw Error("User already exists");

    const hash = await bcrypt.hash(String(req.body.password), 10);

    await db.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        image: image,
        password: hash,
        profile: {
          create: {
            name: req.body.name,
            bio: "About me",
          },
        },
      },
    });

    res.status(201).json({
      message: "User was created successfully",
    });
  } catch (ex) {
    console.log(ex);

    res.status(400).json({
      message: ex.message,
    });
  }
};

// User login

export const login = async (req, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) throw Error("User not found!");

    // comparing the password with the hash

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) throw Error("Incorrect password!");

    // creating the token

    const token = jwt.sign(
      {
        userId: user.id,
      },
      "secret",
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({
      token: token,
      message: "User logged in successfully",
    });
  } catch (ex) {
    res.status(400).json({
      message: ex.message,
    });
  }
};

// API to get all users

export const getAllUsers = async (req, res, next) => {
  const users = await db.user.findMany({
    include: {
      profile: true,
    },
  });
  delete [users.password];

  if (!users) {
    res.status(400).json({
      message: "No users found",
    });
  }
  if (users) {
    res.status(200).json(users);
  }
};

// API to get a single user

export const getOneUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await db.user.findUnique({
    where: { id: Number(id) },
    include: {
      profile: true,
    },
  });
  delete user.password;

  if (!user) {
    res.status(400).json({
      message: "No user found",
    });
  }
  if (user) {
    res.status(200).json({ user });
  }
};

// API to get a user profile

export const getCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      include: {
        profile: true,
      },
    });
    if (!user) throw Error("User not found");

    const count = {};

    count.posts = await db.post.count({ where: { userId: Number(userId) } });
    count.comments = await db.comment.count({
      where: { userId: Number(userId) },
    });
    count.posts = await db.post.count({ where: { userId: Number(userId) } });

    delete user.password;

    res.status(200).json({
      ...user.profile,
      email: user.email,
      image: user.image,
      count,
    });
  } catch ({ message }) {
    res.status(400).json({ message });
  }
};

// API to update a user profile

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      include: {
        profile: true,
      },
    });

    if (!user) throw Error("User not found");

    const updatedUser = await db.user.update({
      where: { id: Number(userId) },
      data: {
        ...req.body,
      },
    });

    if (!updatedUser) throw Error("User not found");

    res.status(200).json({
      message: "User profile updated successfully",
    });
  } catch ({ message }) {
    res.status(400).json({ message });
  }
};

// API to delete a user

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await db.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) throw Error("User not found");
    const deletedUser = await db.user.delete({
      where: { id: Number(userId) },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch ({ err }) {
    res.status(400).json({ err });
  }
};
