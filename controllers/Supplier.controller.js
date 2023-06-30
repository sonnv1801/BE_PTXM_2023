const Supplier = require("../models/Supplier");

const supplierController = {
  createSupplier: async (req, res) => {
    try {
      const newSpplier = await new Supplier({
        name: req.body.name,
        // link: req.body.link,
      });
      const supplier = await newSpplier.save();
      res.status(200).json(supplier);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllSupplier: async (req, res) => {
    try {
      const suppliers = await Supplier.find();
      res.status(200).json(suppliers);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteTypeSupplier: async (req, res) => {
    try {
      const supper = await Supplier.findByIdAndDelete(req.params.id);
      res.status(200).json("Del successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = supplierController;
