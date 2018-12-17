const express = require('express');
const app = express();
const morgan = require('morgan'); // đây là một middleware ! ok tao sẽ đk next function chứ đ trả response
// về đâu nha ! Tao sẽ chỉ log ra cái gì đó còn nv của m làm gì kệ m ! Có thằng này nó log ra dc 
// là method gì , trạng thái , tốn bao nhiêu tg  //GET /orders 200 18.026 ms - 30

const bodyparser = require('body-parser'); //  lớp trung gian node.js để xử lí JSON, dự liệu thô, text và mã hóa URL

const mongoose = require('mongoose');


// Có thằng nodemon thì mỗi lần mình chỉnh cái gì là nó sẽ tự reload lại server
app.use(morgan('dev'));
app.use(express.static('upload')); //  cho folder này static để mn cùng xem dc
// xác định xem coi là dạng body nào mà m muốn nó parse ra 
app.use(bodyparser.urlencoded({extended : false})); // chấp nhận dạng urlencoded
app.use(bodyparser.json()); // chấp nhận data send về dạng json

//Routes which handle request
const productRoutes =require('./api/routes/products');
const odersRouters = require('./api/routes/orders');
const userRouters = require('./api/routes/user');

// kết nối vs mongoose 
mongoose.connect('mongodb://node-shop:' +
process.env.MONGO_ATLAS_PW +
'@note-rest-shop-shard-00-00-jvx5h.mongodb.net:27017,note-rest-shop-shard-00-01-jvx5h.mongodb.net:27017,note-rest-shop-shard-00-02-jvx5h.mongodb.net:27017/test?ssl=true&replicaSet=note-rest-shop-shard-0&authSource=admin&retryWrites=true', 
{
    useNewUrlParser: true
    
});

app.use('/products',productRoutes) // xài cái thằng này để 1 thằng nào đó gõ /product phát thì nó sẽ bay vô file product.js
// để chạy các cái fucntion trong đó

app.use('/orders',odersRouters)
app.use('/user',userRouters);
module.exports = app;

app.use((req,res,next)=>{
    const err = new Error('Not found');
    err.status(404);
    next(err);
});
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        err:{
            message:err.message
        }
    })
});