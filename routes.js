import express from "express";
import multer from "multer";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const name = file.originalname.replace(" ", "_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + "_" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });

import {
  register,
  login,
  getAllUsers,
  getOneUser,
  getCurrentUser,
  updateUser,
  deleteUser,
} from "./controllers/user.js";
import {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost,
} from "./controllers/post.js";
import { createComment, getComments } from "./controllers/comment.js";
import { likePost } from "./controllers/like.js";
import {
  readNotification,
  getAllNotifications,
} from "./controllers/notification.js";
import { uploadFile } from "./controllers/upload.js";
import authMiddleware from "./middleware/auth.js";

const router = express.Router();

// User routes
router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, getAllUsers);
router.get("/users/me", authMiddleware, getCurrentUser);
router.get("/users/:id", authMiddleware, getOneUser);
router.patch("/users/me/update", authMiddleware, updateUser);
router.delete("/users/me/delete", authMiddleware, deleteUser);
router.post("/upload", upload.single("image"), uploadFile);

// Posts routes
router.get("/posts", authMiddleware, getAllPosts);
router.get("/posts/:id", authMiddleware, getOnePost);
router.post("/posts", authMiddleware, createPost);
router.delete("/posts/:id", authMiddleware, deletePost);
router.patch("/posts/:id", authMiddleware, updatePost);

// Comment routes
router.post("/posts/:id/comments", authMiddleware, createComment);
router.get("/posts/:id/comments", authMiddleware, getComments);

// Likes routes
router.post("/posts/:id/likes", authMiddleware, likePost);

router.put("/posts/:id/read", authMiddleware, readNotification);
router.get("/notifications", authMiddleware, getAllNotifications);

export default router;
