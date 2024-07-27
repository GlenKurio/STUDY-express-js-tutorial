import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  {
    id: 1,
    name: "John",
    username: "john123",
  },
  {
    id: 2,
    name: "Jane",
    username: "jane123",
  },
  {
    id: 3,
    name: "Jim",
    username: "jim123",
  },
];

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello World</h1>");
});

app.get("/api/users", (req, res) => {
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

app.post("/api/users", (req, res) => {
  const { name, username } = req.body;
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
});

app.get("/api/users/:id", (req, res) => {
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

app.get("/api/products", (req, res) => {
  res.send([
    {
      id: 1,
      name: "Product 1",
      price: 100,
    },
    {
      id: 2,
      name: "Product 2",
      price: 200,
    },
    {
      id: 3,
      name: "Product 3",
      price: 300,
    },
  ]);
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).send("Invalid ID");
  }

  const userIndex = mockUsers.findIndex((u) => u.id === parsedId);

  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  const { name, username } = req.body;

  if (!name || !username) {
    return res.status(400).send("Name and username are required");
  }

  mockUsers[userIndex] = {
    id: parsedId,
    name,
    username,
  };

  return res.status(200).send(mockUsers);
});

app.patch("/api/users/:id", (req, res) => {
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

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...body,
  };

  return res.status(200).send(mockUsers);
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).send("Invalid ID");
  }

  const userIndex = mockUsers.findIndex((u) => u.id === parsedId);
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  mockUsers.splice(userIndex, 1);
  return res.status(200).send(mockUsers);
});

app.listen(PORT, () => console.log("Server is running on port 3000"));
