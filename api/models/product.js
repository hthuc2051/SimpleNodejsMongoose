const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // tự thêm id
    name: { type: String, require: true },// k dc để null
    price: {type:Number, require:true},
    productImage:{type:String,require:true}
});

module.exports = mongoose.model('Product', productSchema);