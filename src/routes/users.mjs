import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import {
  createUserValidationSchema,
  getUsersValidationSchema,
} from "../../utils/validationSchemas.mjs";
import { mockUsers } from "../../utils/constants.mjs";
import resolveIndexByUserId from "../../utils/middlewares.mjs";

const router = Router();

router.get("/api/users", checkSchema(getUsersValidationSchema), (req, res) => {
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

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }

    const data = matchedData(req);

    const { name, username } = data;
    if (!name || !username) {
      return res.status(400).send("Name and username are required");
    }
    const newUser = {
      id: mockUsers.length + 1,
      name,
      username,
    };
    mockUsers.push(newUser);
    return res.status(201).send(mockUsers);
  }
);

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
