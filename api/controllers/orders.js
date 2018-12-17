const Order  = require("../models/order");

exports.orders_get_all = (req,res,next) => {
    Order.find().select("product quantity _id")
    .populate("product","name")
    .exec()
    .then(docs =>{
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc=>{
                return {
                    _id :doc._id,
                    product:doc.product,
                    quantity : doc.quantity,
                    request:{
                        type:"GET",
                        url:"SKT"
                    }
                }
            })
        });
    })
    .catch(err=>{
        res.status(500).json({
            error :err
        })
    })
};