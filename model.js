const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
  },
  image: { 
    type: String,
    required: true,
  },
  price: { 
    type: String,
    required: true,
  },
  link: { 
    type: String,
    required: true,
  },
  description: { 
    type: String,
    default:"A product you will like"
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;