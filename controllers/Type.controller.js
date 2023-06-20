const Type = require("../models/Type");

const typeController = {
  getAllTypeComBo: async (req, res) => {
    try {
      const combo = await Type.find();
      res.status(200).json(combo);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createTypeComBo: async (req, res) => {
    try {
      const newType = await new Type({
        name: req.body.name,
      });
      const type = await newType.save();
      res.status(200).json(type);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteTypeComBo: async (req, res) => {
    try {
      const combo = await Type.findByIdAndDelete(req.params.id);
      res.status(200).json("Del successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = typeController;
