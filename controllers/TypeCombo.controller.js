const TypeCombo = require("../models/TypeCombo");

const typeComboController = {
  getAllTypeComBo: async (req, res) => {
    try {
      const combo = await TypeCombo.find();
      res.status(200).json(combo);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createTypeComBo: async (req, res) => {
    try {
      const newType = await new TypeCombo({
        name: req.body.name,
        link: req.body.link,
      });
      const type = await newType.save();
      res.status(200).json(type);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteTypeComBo: async (req, res) => {
    try {
      const combo = await TypeCombo.findByIdAndDelete(req.params.id);
      res.status(200).json("Del successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = typeComboController;
