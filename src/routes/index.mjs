import {Router} from "express";
import usersRouter from "./users.mjs"
import productsRouter from "./products.mjs"
import cartRouter from "./cart.mjs"

const router = Router();

router.use(usersRouter)
router.use(productsRouter)
router.use(cartRouter)

export default router;