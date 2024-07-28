import passport from "passport";

import { Strategy } from "passport-local";
import { mockUsers } from "../../utils/constants.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    try {
      const user = mockUsers.find((u) => u.username === username);

      if (!user) throw new Error("User not found");

      if (user.password !== password) throw new Error("Wrong password");

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  })
);
