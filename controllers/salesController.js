import MonthlySales from "../models/monthlySales.js";

// CREATE
export const createSale = async (req, res) => {
  try {
    const newSale = await MonthlySales.create(req.body);
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ
export const getSales = async (req, res) => {
  try {
    const sales = await MonthlySales.find();
    if (sales.length === 0) {
      return res.status(404).json({ error: "No sales found" });
    }
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateSale = async (req, res) => {
  try {
    const sale = await MonthlySales.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteSale = async (req, res) => {
  try {
    const sale = await MonthlySales.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    res.json({ message: `Sale ID ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};