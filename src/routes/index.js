import { Router } from "express";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import viewsRouter from "./viewRouter.js";


const router = Router();
router.use('/', viewsRouter);
router.use('/products', productsRouter);
router.use("/carts", cartsRouter);

export default router;

