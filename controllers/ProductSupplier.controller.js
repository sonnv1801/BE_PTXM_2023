const ProductSupplier = require("../models/ProductSupplier");

const cloudinary = require("../utils/cloudinary");

const productSupplierController = {
  createProduct: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "QUANLYPHUTUNG",
      });
      let newProduct = new ProductSupplier({
        image: result.secure_url,
        agentCode: req.body.agentCode,
        productCode: req.body.productCode,
        salePrice: req.body.salePrice,
        retailPrice: req.body.retailPrice,
        wholesalePrice: req.body.wholesalePrice,
        name: req.body.name,
        quantity: req.body.quantity,
        supplier: req.body.supplier,
        link: req.body.link,
        type: req.body.type,
      });
      await newProduct.save();
      res.status(200).json(newProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getProductByLink: async (req, res) => {
    try {
      const link = req.params.link;
      const limit = req.params.limit;
      const prdbylink = await ProductSupplier.find({ link: link }).limit(limit);
      return res.status(200).json(prdbylink);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getProductById: async (req, res) => {
    const productId = req.params.id;

    try {
      const product = await ProductSupplier.findOne({ _id: productId });

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

  updateProductSupplier: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "QUANLYPHUTUNG",
      });
      const results = await ProductSupplier.findById(req.params.id);
      if (results.productId === req.body.productId) {
        await results.updateOne({
          $set: {
            image: result.secure_url,
            agentCode: req.body.agentCode,
            productCode: req.body.productCode,
            salePrice: req.body.salePrice,
            retailPrice: req.body.retailPrice,
            wholesalePrice: req.body.wholesalePrice,
            name: req.body.name,
            quantity: req.body.quantity,
            supplier: req.body.supplier,
            link: req.body.link,
            type: req.body.type,
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

  deleteProductSupplier: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await ProductSupplier.findById(productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }

      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await ProductSupplier.findByIdAndDelete(productId);
      res.status(200).json("Delete product successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },
  getAllProductSupplier: async (req, res) => {
    try {
      const products = await ProductSupplier.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = productSupplierController;
