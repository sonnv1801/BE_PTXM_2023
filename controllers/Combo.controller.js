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
      const { image, link, title, type, products, status, quantity } = req.body;
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
        quantity,
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

        // Cập nhật giá mới
        const newPrice = combo.products.reduce(
          (totalPrice, product) => totalPrice + product.price,
          0
        );
        combo.newPrice = newPrice;
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
      const { comboId } = req.params;
      const { image, title, type, link, status, quantity, products } = req.body;

      // Tìm combo theo comboId
      const combo = await Combo.findById(comboId);

      if (!combo) {
        return res.status(404).json({ message: "Combo không tồn tại." });
      }

      // Cập nhật thông tin combo
      combo.image = image;
      combo.title = title;
      combo.type = type;
      combo.link = link;
      combo.status = status;
      combo.quantity = quantity;

      let totalNewPrice = 0;

      // Cập nhật thông tin các sản phẩm trong combo và tính toán newPrice
      for (let i = 0; i < products.length; i++) {
        const {
          image,
          name,
          productCode,
          price,
          oldPrice,
          status,
          quantity,
          remainingQuantity,
        } = products[i];
        const product = combo.products[i];

        product.image = image;
        product.name = name;
        product.productCode = productCode;
        product.price = price;
        product.oldPrice = oldPrice;
        product.status = status;
        product.quantity = quantity;
        product.remainingQuantity = remainingQuantity;

        // Tính toán newPrice của sản phẩm
        product.newPrice = price * (quantity - remainingQuantity);

        // Tổng hợp tổng giá trị newPrice của tất cả sản phẩm
        totalNewPrice += product.newPrice;
      }

      // Lưu các thay đổi vào cơ sở dữ liệu
      await combo.save();

      // Cập nhật tổng giá trị newPrice của combo
      combo.newPrice = totalNewPrice;

      res.json(combo);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message:
          "Đã xảy ra lỗi khi cập nhật thông tin combo và các sản phẩm trong combo.",
      });
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

  reduceComboQuantity: async (req, res) => {
    try {
      const comboId = req.params.id; // Combo ID from the request parameters
      const { quantityCombo, products } = req.body; // Quantity of combo and products

      // Find the combo by ID
      const combo = await Combo.findById(comboId);
      if (!combo) {
        return res.status(404).json({ message: "Combo not found" });
      }

      // Check if the requested quantityCombo is valid
      if (quantityCombo > combo.quantity) {
        return res.status(400).json({ message: "Invalid quantityCombo" });
      }

      // Reduce the combo quantity
      combo.quantity -= quantityCombo;

      // Reduce the quantity of each product within the combo and update remainingQuantity
      products.forEach((product) => {
        const { productId, quantity } = product;
        const foundProduct = combo.products.find(
          (p) => p._id.toString() === productId
        );
        if (foundProduct) {
          foundProduct.quantity -= quantity;
          foundProduct.remainingQuantity = foundProduct.quantity;
        }
      });

      // Save the updated combo
      await combo.save();

      res.status(200).json({ message: "Combo quantity reduced successfully" });
    } catch (error) {
      console.error("Error reducing combo quantity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getDetailProductByID: async (req, res) => {
    const productId = req.params.id;

    try {
      const combos = await Combo.find();
      if (!combos) {
        return res.status(404).json({ error: "No combos found" });
      }

      const products = [];
      combos.forEach((combo) => {
        const matchingProduct = combo.products.find(
          (product) => product._id.toString() === productId
        );
        if (matchingProduct) {
          products.push(matchingProduct);
        }
      });

      if (products.length === 0) {
        return res
          .status(404)
          .json({ error: "Product not found in any combo" });
      }

      res.send(products[0]); // Trả về đối tượng sản phẩm trực tiếp
    } catch (error) {
      console.error("Error retrieving combo products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = comboController;
