import { Router } from "express";

const router = Router();
router.get("/api/products", (req, res) => {
  // console.log(req.headers.cookie);
  // console.log(req.cookies);
  console.log(req.signedCookies);
  if (req.signedCookies.hi && req.signedCookies.hi === "ole") {
    return res.send([
      {
        id: 1,
        name: "Product 1",
        price: 100,
      },
    ]);
  }

  return res.send("Not authorized");
});

export default router;
