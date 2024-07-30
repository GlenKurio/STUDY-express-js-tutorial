import express from "express";

import { loggingMiddleware } from "../utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "../utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo'
import "./strategies/local-strategy.mjs";

const app = express();

mongoose
  .connect("mongodb+srv://glebkurip:aNvLBUBx6Vx5izID@cluster0.vubrnmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser("holaworlda"));
app.use(
  session({
    secret: "secret word for cookies",
    saveUninitialized: false, //do not save empty sessions
    resave: true, // resave session when it's modified instead of creating a new record in db on each request
    cookie: { maxAge: 60000 * 60 * 24 * 14 },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

app.get("/api/auth/discord/redirect", passport.authenticate("discord"), (req, res) => {
  res.sendStatus(200);
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(500);
    return res.sendStatus(200);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server is running on port 3000"));
