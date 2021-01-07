var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
app.use(bodyParser.json());

var dbPath = 'mongodb+srv://yash:user@nodeproject.7ixwv.mongodb.net/test?retryWrites=true&w=majority';

var Product = mongoose.model('product', {
    product: {
        productid: Number,
        category: String,
        price: String,
        name: String,
        instock: Boolean
    },
    id : Number
});

mongoose.connect(dbPath, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, (err) => {
    console.log("Mongodb connection", err);
});

/**
 * Retriving all products
 */
app.get('/product/get/', async (req, res) => {
    var products = {};
    var data = await Product.find({});
    data.forEach((value) => {
        products[value.id] = value.product;
    });
    res.send(products);
});

/**
 * Adding product
 */
app.post('/product/create/', async (req, res) => {
    try{
        var product = new Product(req.body);
        await product.save();
        console.log("Saved");
        res.sendStatus(200);
    }catch (error) {
        res.sendStatus(500);
    }
});

/**
 * Update product list
 */
app.put('/product/update/:id', async (req, res) => {
    try{
        var requestId = req.params.id;
        console.log(req.body)
        await Product.findOneAndUpdate({id: requestId}, req.body);
        res.sendStatus(200);   
    }catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});

/**
 * Delete product
 */
app.delete('/product/delete/:id', async (req, res) => {
    try{
        var requestId = req.params.id;
        await Product.findOneAndDelete({id: requestId});
        res.sendStatus(200);
    }catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});