const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order  = require("../models/order");
const checkAuth = require('../middleware/check-auth');
const Product = require('../models/product');

const OrderControllder = require('../controllers/orders');

router.get('/',checkAuth, OrderControllder.orders_get_all);

router.post('/',checkAuth,(req,res,next)=>{
    Product.findById(req.body.productID)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message:"Product not found"
            });
        }
        const order = new Order({
            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productID
        });
        return order.save();
    })
    .then(result=>{
        console.log(result);
        res.status(500).json({
            message:"Order stored ",
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            Error:err
        });
    });
});

router.get('/:orderID',(req,res,next)=>{
    res.status(200).json({
        message :'Order details',
        orderID:req.params.orderID
    });
});

router.delete('/:orderID',checkAuth,(req,res,next)=>{
    res.status(200).json({
        message :'Order deleted',
        orderID:req.params.orderID
    });
});

module.exports =router;