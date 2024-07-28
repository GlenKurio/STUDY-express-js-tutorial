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

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server is running on port 3000"));
