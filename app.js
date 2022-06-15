import express from "express";
import cors from "cors";
import appRoutes from "./routes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/v1", appRoutes);

export default app;
