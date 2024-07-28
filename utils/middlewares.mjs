import { mockUsers } from "./constants.mjs";

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).send("Invalid ID");
  }
  const userIndex = mockUsers.findIndex((u) => u.id === parsedId);

  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  req.userIndex = userIndex;
  next();
};
export default resolveIndexByUserId;

export const loggingMiddleware = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};
