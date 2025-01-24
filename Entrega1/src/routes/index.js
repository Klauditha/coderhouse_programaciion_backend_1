const { Router } = require("express");
const productsRouter = require("./products.router.js");
const cartsRouter = require("./carts.router.js");

const router = Router();

router.use("/products", productsRouter);
router.use("/carts", cartsRouter);

module.exports = router;

