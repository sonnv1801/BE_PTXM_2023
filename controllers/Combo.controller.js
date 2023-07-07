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
      const { link, title, type, status, quantity, products } = req.body;

      // Kiểm tra xem có tệp tin được gửi lên không
      if (!req.file) {
        return res.status(400).json({ error: "Không có tệp tin gửi lên" });
      }

      const file = req.file;

      // Tải ảnh combo lên Cloudinary
      const comboImage = await cloudinary.uploader.upload(file.path, {
        folder: "QUANLYPHUTUNG",
      });

      const productImages = [];
      let newPrice = 0; // Initialize newPrice variable

      // Tải ảnh của từng sản phẩm trong combo lên Cloudinary
      for (const product of products) {
        const productImage = await cloudinary.uploader.upload(product.images, {
          folder: "QUANLYPHUTUNG",
        });
        productImages.push({
          ...product,
          images: productImage.secure_url,
        });
        newPrice += parseFloat(product.price) || 0;
      }

      const combo = new Combo({
        image: comboImage.secure_url,
        link,
        title,
        type,
        products: productImages,
        quantity,
        status,
        newPrice,
      });

      const savedCombo = await combo.save();

      res.status(201).json(savedCombo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  },

  addAdditionalProductsToCombo: async (req, res) => {
    try {
      // Tải lên hình ảnh lên Cloudinary
      const image = await cloudinary.uploader.upload(req.file.path, {
        folder: "QUANLYPHUTUNG",
      });

      // Tìm combo dựa trên comboId
      const combo = await Combo.findById(req.params.comboId);

      if (!combo) {
        return res.status(404).json({ error: "Combo not found" });
      }

      // Tạo một sản phẩm mới với giá là giá của sản phẩm mới
      const newProduct = {
        name: req.body.name,
        images: image.secure_url,
        productCode: req.body.productCode,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        status: req.body.status,
        quantity: req.body.quantity,
        remainingQuantity: req.body.remainingQuantity,
      };

      // Thêm sản phẩm mới vào combo
      combo.products.push(newProduct);

      // Tính toán giá mới của combo dựa trên danh sách sản phẩm
      let newPrice = 0;
      combo.products.forEach((product) => {
        newPrice += product.price;
      });
      combo.newPrice = newPrice;

      // Lưu combo đã được cập nhật
      const updatedCombo = await combo.save();

      res.json(updatedCombo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  deleteProductFromCombo: async (req, res) => {
    try {
      const comboId = req.params.comboId; // ID của combo
      const productId = req.params.productId; // ID của sản phẩm

      // Kiểm tra xem combo có tồn tại không
      const combo = await Combo.findById(comboId);
      if (!combo) {
        return res.status(404).json({ error: "Combo not found" });
      }

      // Tìm sản phẩm trong combo và xóa nó
      const updatedProducts = combo.products.filter(
        (product) => product._id.toString() !== productId
      );
      combo.products = updatedProducts;

      // Tính lại newPrice của combo
      let newPrice = 0;
      updatedProducts.forEach((product) => {
        newPrice += product.price;
      });
      combo.newPrice = newPrice;

      // Lưu combo đã cập nhật vào cơ sở dữ liệu
      await combo.save();

      return res
        .status(200)
        .json({ message: "Product removed from combo successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Failed to remove product from combo" });
    }
  },

  UpdateToCombo: async (req, res) => {
    try {
      const { comboId } = req.params;
      const { title, type, link, status, quantity, products } = req.body;

      // Tìm combo theo comboId
      const combo = await Combo.findById(comboId);

      if (!combo) {
        return res.status(404).json({ message: "Combo không tồn tại." });
      }

      // Kiểm tra nếu có tệp tin combo mới được gửi lên
      if (req.file) {
        // Tải ảnh combo lên Cloudinary
        const comboImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "QUANLYPHUTUNG",
        });

        // Cập nhật ảnh combo
        combo.image = comboImage.secure_url;
      }

      // Cập nhật thông tin combo nếu được cung cấp
      if (title) combo.title = title;
      if (type) combo.type = type;
      if (link) combo.link = link;
      if (status) combo.status = status;
      if (quantity) combo.quantity = quantity;

      if (Array.isArray(products)) {
        for (let i = 0; i < products.length; i++) {
          const {
            name,
            images: productImage,
            productCode,
            price,
            oldPrice,
            status,
            quantity,
            remainingQuantity,
          } = products[i];
          const product = combo.products[i];

          // Kiểm tra nếu có ảnh sản phẩm mới được gửi lên
          if (productImage && productImage.startsWith("data:image")) {
            // Tải ảnh sản phẩm lên Cloudinary
            const uploadedProductImage = await cloudinary.uploader.upload(
              productImage,
              {
                folder: "QUANLYPHUTUNG",
              }
            );

            // Cập nhật ảnh sản phẩm
            product.images = uploadedProductImage.secure_url;
          }

          // Cập nhật thông tin sản phẩm
          if (name) product.name = name;
          if (productCode) product.productCode = productCode;
          if (price) {
            product.price = price;
          }
          if (oldPrice) product.oldPrice = oldPrice;
          if (status) product.status = status;
          if (quantity) product.quantity = quantity;
          if (remainingQuantity) product.remainingQuantity = remainingQuantity;
        }

        // Tính toán và cập nhật giá mới cho combo
        let newPrice = 0;
        for (let i = 0; i < combo.products.length; i++) {
          const product = combo.products[i];
          newPrice += product.price;
        }
        combo.newPrice = newPrice;
      }

      await combo.save();

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
      products?.forEach((product) => {
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
      combos?.forEach((combo) => {
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
