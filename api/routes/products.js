const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination:function(req,file,cb){// cb : callback
        cb(null, './upload/'); 
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname); 
    }
});
const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/png'|| file.mimetype ==='image/jpg'){
       cb(null,true);
    }else{
       cb(null,false);
    }

};
const upload = multer({
    storage:storage,
    limits:{
    fieldSize :1024*1024*5
    },
    fileFilter:fileFilter
});

const Product = require('../models/product');

// để vầy vì ngoài app.js đã định nghĩa nó ts đây rồi ! nếu còn để là /products nữa thì nó
// sẽ thành products/products 
router.get('/', (req, res, next) => {
    // Product.find().where dùng thằng này để thêm query nè
    // Product.find().limit lấy ra 1 vài thằng th để phân trang
    Product.find()
        .select("name price _id") // select những gì thì để vô đây
        .exec()
        .then(docs => {
            const result = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
});


router.post('/', checkAuth, upload.single('productImage') ,(req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), // tự thêm id
        name: req.body.name, // tên của biến ngoài view ném vô phải theo name trước
        price: req.body.price,
        productImage : req.file.path
    })
    product
        .save()
        .then(result => {
            res.status(200).json({
                message: "Create product successfully",
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage : result.productImage,
                request: {
                    message: "See this product the details",
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });

});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id).then(doc => {
        console.log(doc);
        if (doc) {
            res.status(500).json({
                product: doc,
                request: {
                    message: 'See all products',
                    type: 'GET',
                    url: 'http://localhost:3000/products/'
                }
            });
        } else {
            res.status(404).json({ message: 'No data for that id' });
        }

    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.patch('/:productID', checkAuth, (req, res, next) => {
    const id = req.params.productID;

    const updateOps = {};
    for (const ops of req.body) {
        console.log(ops.value);
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Update product successfully",
                request: {
                    type: 'See new details',
                    url: 'http://localhost:3000/products/' + id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.delete('/:productID', checkAuth, (req, res, next) => {
    const id = req.params.productID;
    console.log(id);
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });

});
module.exports = router;