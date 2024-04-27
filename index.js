const express = require("express");
const port = 7000;
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const Product = require('./model');

mongoose.connect('mongodb+srv://ayeshamulla369:ayeshamulla@cluster0.tgngr6z.mongodb.net/').then(
    () => {
        console.log('Connected to database');
    }).catch((err) => {
        console.log('Error connecting to database ' + err);
    })


const upload = multer();

app.get("/", (req, res) => {
  res.send(`
    <form action="/" method="POST" enctype="multipart/form-data">
      <label for="productName">Type Product name:</label><br><br>
      <input type="text" id="productName" name="productName" required><br><br><br><br>
      <label for="price">Type Price:</label><br><br>
      <input type="text" id="price" name="price" required><br><br><br><br>
      <label for="link">Type Link:</label><br><br>
      <input type="text" id="link" name="link" required><br><br><br><br>
      <label for="myfile">Select an Image:</label><br><br>
      <input type="file" id="myfile" name="myfile" required><br><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/", upload.single("myfile"), async(req, res) => {
  if (req.file) {
    const productName = req.body.productName; // Get the product name from the form

    const linkUrl = req.body.link;
    const price = req.body.price;

    const base64Image = Buffer.from(req.file.buffer).toString("base64"); 
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    try{
        const newProductPostData = {
            name: productName,
            image: imageUrl,
            link: linkUrl,
            price: price
        }
        const newProductPost = new Product(newProductPostData);
        console.log("Hive data ti db",newProductPost);
        await newProductPost.save();
    }catch (error) {
        res.status(500).json({ message: "post creation failed" });
    }

    // You can perform operations with the product name here

    res.send(`
      <h2>Image Uploaded Successfully:</h2>
      <p>Product Name: ${productName}</p>
      <p>Price: ${price}</p>
      <p>Link: ${linkUrl}</p>
      <img src="${imageUrl}" alt="Uploaded Image" height="248">
    `);
  } else {
    res.status(500).json({ message: "Failed due to inccorect file type" });
  }
});



app.get('/AllProducts' ,(req, res) => {
    try {
        
        Product.find()
        .then((products) => {
          if (products && products.length > 0) {
            console.log(products); // Logging all products
            res.status(200).json(products); // Sending all products as JSON response
          } else {
            console.log("No content from products");
            res.status(200).json({ message: "No products content" });
          }
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          res.status(500).json({ message: "Internal Server Error" });
        });

      } catch (error) {
        res.status(500).json({ message: "error getting the products" });
      }
  });

app.listen(port, () => {
  console.log("Server is running on port " + port);
});


module.exports = app;
