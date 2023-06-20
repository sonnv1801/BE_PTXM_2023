const Combo = require("../models/Combo");
const cloudinary = require("../utils/cloudinary");
comboController = {
  getAllCombo: async (req, res) => {
    try {
      const combo = await Combo.find();
      res.status(200).json(combo);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getComBoById: async (req, res) => {
    const comboId = req.params.id;

    try {
      const product = await Combo.findOne({ _id: comboId });

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

  getComBoByLink: async (req, res) => {
    try {
      const typeCombo = req.params.typeCombo;
      const limit = req.params.limit;
      const combos = await Combo.find({ link: typeCombo }).limit(limit);
      return res.status(200).json(combos);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createCombo: async (req, res) => {
    try {
      const { image, link, name, typeCombo, products } = req.body;
      const combo = new Combo({
        image: image,
        link: link,
        name,
        typeCombo,
        products,
      });
      const savedCombo = await combo.save();
      res.status(201).json(savedCombo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createCombo: async (req, res) => {
    try {
      const { image, link, title, type, products, status } = req.body;
      let newPrice = 0;

      for (const product of products) {
        newPrice += product.price;
      }

      const combo = new Combo({
        image: image,
        link: link,
        title,
        type,
        products,
        newPrice,
        status: status, // Thay "Your Combo Status" bằng trạng thái thích hợp của combo
      });

      const savedCombo = await combo.save();

      res.status(201).json(savedCombo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  addAdditionalProductsToCombo: async (req, res) => {
    try {
      const { additionalProducts } = req.body;
      const { comboId } = req.params;

      // Tìm combo dựa trên comboId
      const combo = await Combo.findById(comboId);

      if (!combo) {
        return res.status(404).json({ error: "Combo not found" });
      }

      // Thêm sản phẩm bổ sung vào combo
      if (additionalProducts && additionalProducts.length > 0) {
        combo.products.push(...additionalProducts);
      }

      const savedCombo = await combo.save();
      res.status(201).json(savedCombo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  UpdateToCombo: async (req, res) => {
    try {
      const { comboId, productId } = req.params;
      const {
        name,
        productCode,
        price,
        oldPrice,
        status,
        quantity,
        remainingQuantity,
      } = req.body;

      const combo = await Combo.findById(comboId);
      if (!combo) {
        return res.status(404).json({ error: "Combo not found" });
      }

      const productIndex = combo.products.findIndex(
        (product) => product._id.toString() === productId
      );
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in combo" });
      }

      const updatedProduct = combo.products[productIndex];
      updatedProduct.name = name;
      updatedProduct.productCode = productCode;
      updatedProduct.price = price;
      updatedProduct.oldPrice = oldPrice;
      updatedProduct.status = status;
      updatedProduct.quantity = quantity;
      updatedProduct.remainingQuantity = remainingQuantity;

      const savedCombo = await combo.save();

      res.json(savedCombo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  DeletetoCombo: async (req, res) => {
    try {
      const { comboId, productId } = req.params;

      const combo = await Combo.findById(comboId).lean();
      if (!combo) {
        return res.status(404).json({ error: "Combo not found" });
      }

      const updatedProducts = combo.products.filter(
        (product) => product._id.toString() !== productId
      );

      combo.products = updatedProducts;

      const savedCombo = await Combo.findByIdAndUpdate(comboId, combo, {
        new: true,
      });

      res.json(savedCombo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  DeleteComboByID: async (req, res) => {
    try {
      const combo = await Combo.findByIdAndDelete(req.params.id);
      res.status(200).json("Del successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateComboByID: async (req, res) => {
    const results = await Combo.findById(req.params.id);
    try {
      if (results.comboId === req.body.comboId) {
        await results.updateOne({
          $set: {
            name: req.body.name,
            typeCombo: req.body.typeCombo,
          },
        });
        res.status(200).json("Update user successfully");
      } else {
        res.status(500).json("Can't update");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = comboController;
