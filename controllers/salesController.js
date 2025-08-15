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
    const {
      page = 1,
      limit = 100,
      email,
      country,
      state,
      city,
      document,
      lastChangeStart,
      lastChangeEnd,
      creationDateStart,
      creationDateEnd,
      sortField = "creationDate",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;
    const filters = {};

    const dateFilter = (start, end) => {
      const range = {};
      if (start) range.$gte = new Date(start);
      if (end) range.$lte = new Date(end);
      return Object.keys(range).length ? range : null;
    };

    const lastChangeRange = dateFilter(lastChangeStart, lastChangeEnd);
    if (lastChangeRange) filters.lastChange = lastChangeRange;

    const creationDateRange = dateFilter(creationDateStart, creationDateEnd);
    if (creationDateRange) filters.creationDate = creationDateRange;

    if (email) filters["additionalSellerInformation.email"] = email;
    if (country) filters["additionalSellerInformation.country"] = country;
    if (state) filters["additionalSellerInformation.state"] = state;
    if (city) filters["additionalSellerInformation.city"] = city;
    if (document) filters["additionalSellerInformation.document"] = document;

    const [totalSales, sales] = await Promise.all([
      MonthlySales.countDocuments(filters),
      MonthlySales.find(filters)
        .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit)),
    ]);

    if (!sales.length) {
      return res.status(404).json({ error: "No sales found" });
    }

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalSales,
      totalPages: Math.ceil(totalSales / limit),
      sales,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateSale = async (req, res) => {
  try {
    if (req.body.additionalSellerInformation) {
      for (const info of req.body.additionalSellerInformation) {
        if (info.document || info.birthDate) {
          return res.status(400).json({
            error: "Customer document and birth date cannot be changed",
          });
        }
      }
    }

    const sale = await MonthlySales.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteSaleById = async (req, res) => {
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
