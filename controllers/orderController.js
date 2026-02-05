import Order from "../models/oder.js";
import Product from "../models/Product.js";

export async function createorder(req,res) {

    if(req.user == null){
        res.status(401).json({
            message : "Unauthorized"
        });
        return;
    }

    try{
          const latestOrder = await Order.findOne().sort({date : -1})
    let orderID = "ORD000001"

    if(latestOrder!=null){
        let latestOrderId = latestOrder.orderID;
        let latestOrderNumberString = latestOrderId.replace("ORD", "");
        let latestOrderNumber = parseInt(latestOrderNumberString);

        let newOrderNumber = latestOrderNumber + 1;
        let newOrderNumberString = newOrderNumber.toString().padStart(6, "0");
        orderID ="ORD" + newOrderNumberString;

    }

    const items = []
    let total = 0

    for(let i =0; i < req.body.items.length; i++){
        const product = await Product.findOne({productID : req.body.items[i].productID})
        if(product == null){
            return res.status(400).json({
                message : `Product with ID ${req.body.items[i].productID} not found`
            })
        }
        items.push({
            productID : product.productID,
            name : product.name,
            price : product.price,
            quantity : req.body.items[i].quantity,
            image : product.images[0]

        })

        total += product.price * req.body.items[i].quantity

        // await product.updateOne(
        //     {productID : product.productID},
        //     {stock : product.stock = req.body.items[i].quantity}

        // )

    }
    let name = req.body.name
    if(name == null){
        name = req.user.firstName + " "+ req.user.lastName
    }

    const newOrder = new Order({
        orderID : orderID,
        email : req.user.email,
        name : name,
        address : req.body.address,
        total : total,
        items : items,
        

    })
    await newOrder.save()

    // for (let i=0; i < items.length; i++){
    //     await Product.updateOne(
    //         { productID : items[i].productID},
    //         { $inc : { stock : -items[i].quantity }}
    //     )
    // }

    return res.json({
        message : "Order placed Success",
        orderID : orderID
    })
    

    }catch(error){
        return res.status(500).json({
            message : "Error genarating order ID",
            error : error.message
        });
    }
  

}