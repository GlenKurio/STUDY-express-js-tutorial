import { Router } from "express";
import { validationResult } from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";
import resolveIndexByUserId from "../../utils/middlewares.mjs";
import { User } from "../schemas/user.mjs";

const router = Router();
// checkSchema(getUsersValidationSchema),
router.get("/api/users", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send(result.array());
  }
  const {
    query: { filter, value },
  } = req;

  if (filter && value) {
    return res.send(
      mockUsers.filter((u) =>
        u[filter].includes(value.split("")[0].toUpperCase() + value.slice(1))
      )
    );
  }

  return res.send(mockUsers);
});

router.post("/api/users", async (req, res) => {
  const { body } = req;
  const newUser = new User(body);
  try {
    const savedUser = await newUser.save();

    return res.status(201).send(savedUser);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).send("Invalid ID");
  }

  const user = mockUsers.find((u) => u.id === parsedId);
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.send(user);
});

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex, body } = req;

  mockUsers[userIndex] = {
    id: mockUsers[userIndex].id,
    ...body,
  };

  return res.status(200).send(mockUsers);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex, body } = req;

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...body,
  };

  return res.status(200).send(mockUsers);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  mockUsers.splice(userIndex, 1);
  return res.status(200).send(mockUsers);
});

export default router;
