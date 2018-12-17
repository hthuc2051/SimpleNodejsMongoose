const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // tự thêm id
    product:{type:mongoose.Schema.Types.ObjectId, ref:'Product',require:true },
    // many to many : 
    //product:[{
    //    type:mongoose.Schema.Types.ObjectId,
  //      ref:'Product'
  //  }]
    quantity:{type:Number, default:1 }

});

module.exports = mongoose.model('Order', orderSchema);