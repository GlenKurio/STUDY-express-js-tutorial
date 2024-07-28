import express from "express";

import { loggingMiddleware } from "../utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "../utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser("holaworlda"));
app.use(
  session({
    secret: "secret word for cookies",
    saveUninitialized: false, //do not save empty sessions
    resave: false,
    cookie: { maxAge: 60000 * 60 * 24 * 14 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

// app.use(loggingMiddleware); // global middleware

const PORT = process.env.PORT || 3000;

app.get("/", loggingMiddleware, (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  req.session.visited = true;
  res.cookie("hi", "ole", { maxAge: 60000 * 60 * 2, signed: true });
  res.status(200).send("<h1>Hello World</h1>");
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUser = mockUsers.find((u) => u.username === username);

  if (!findUser || findUser.password !== password) {
    return res.status(401).send("User not found");
  }

  req.session.user = findUser;

  res.status(200).send("welcome");
});

app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send("Unauthorized");
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.status(401).send("Unauthorized");
  const { body: item } = req;
  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.status(401).send("Unauthorized");
  return res.status(200).send(req.session.cart || []);
});

// app.use(loggingMiddleware); // middleware for all routes below

app.listen(PORT, () => console.log("Server is running on port 3000"));
