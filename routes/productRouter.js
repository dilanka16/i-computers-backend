import express from "express"
import { createProduct, deleteProduct, getAllProducts, getProductByID, searchProducts, updateProduct } from "../controllers/productController.js"


const productRouter = express.Router()

productRouter.get("/", getAllProducts)

productRouter.get("/:productID", getProductByID)

productRouter.get("/trending", (res,req)=>{
    res.json(
        {message : "trending products endpoint"}
    )
})

productRouter.post("/", createProduct)

productRouter.get("/search/:query", searchProducts)

productRouter.delete("/:productID",deleteProduct)

productRouter.put("/:productID",updateProduct)



export default productRouter

