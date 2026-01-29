import mongoose from "mongoose";

const productschema = new mongoose.Schema(
    {
        productID : {
            type : String,
            required : true,
            unique : true  // eak product id ekkain eka id ekai thynne puluwan
        },
        name : {
            type : String,
            required : true
        },
        altName : {
            type : [String],
            default : []
        },
        desciption : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        labelledPrice : {
            type : Number,
            required : true
        },
        images : {
            type : [String],
            required : true
        },
        category : {
            type : String,
            required : true
        },
        model: {
            type : String,
            required : true,
            default : "Standard"
        },
        brand : {
            type : String,
            required : true,
            default : "Genaric"
        },
        stock : {
            type : Number,
            required : true,
            default : 0
        },
        isAvailable : {
            type : Boolean,
            default : true
        }
    }
)

const Product = mongoose.model("Product", productschema)

export default Product;