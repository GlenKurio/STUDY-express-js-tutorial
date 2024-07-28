import express from "express";

import { loggingMiddleware } from "../utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser("holaworlda"));

app.use(routes);

// app.use(loggingMiddleware); // global middleware

const PORT = process.env.PORT || 3000;

app.get("/", loggingMiddleware, (req, res) => {
  // local middleware
  res.cookie("hi", "ole", { maxAge: 60000 * 60 * 2, signed: true });
  res.status(200).send("<h1>Hello World</h1>");
});

// app.use(loggingMiddleware); // middleware for all routes below

app.listen(PORT, () => console.log("Server is running on port 3000"));
