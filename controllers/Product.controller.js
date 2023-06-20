const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const product = {
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getProductById: async (req, res) => {
    const productId = req.params.id;

    try {
      const product = await Product.findOne({ _id: productId });

      if (!product) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      } else {
        return res.json(product);
      }
    } catch (error) {
      console.error("Lỗi truy vấn MongoDB:", error);
      return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "QUANLYPHUTUNG",
      });
      let newProduct = new Product({
        image: result.secure_url,
        title: req.body.title,
        code: req.body.code,
        type: req.body.type,
        description: req.body.description,
        newPrice: req.body.newPrice,
        oldPrice: req.body.oldPrice,
        quantity: req.body.quantity,
        rates: req.body.rates,
      });
      await newProduct.save();
      res.status(200).json(newProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateProduct: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "QUANLYPHUTUNG",
      });
      const results = await Product.findById(req.params.id);
      if (results.productId === req.body.productId) {
        await results.updateOne({
          $set: {
            image: result.secure_url,
            title: req.body.title,
            code: req.body.code,
            type: req.body.type,
            description: req.body.description,
            newPrice: req.body.newPrice,
            oldPrice: req.body.oldPrice,
            quantity: req.body.quantity,
          },
        });
        res.status(200).json("Update product successfully");
      } else {
        res.status(500).json("Can't update prduct");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }

      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await Product.findByIdAndDelete(productId);
      res.status(200).json("Delete product successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },

  getProductByType: async (req, res) => {
    try {
      const type = req.params.type;
      const limit = req.params.limit;
      const products = await Product.find({ type: type }).limit(limit);
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = product;
