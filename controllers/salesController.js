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
      allowedSortFields = [
        "creationDate",
        "lastChange",
        "year",
        "month",
        "totalSold",
      ],
    } = req.query;

    const skip = (page - 1) * limit;
    const filters = {};

    const dateFilter = (start, end) => {
      const range = {};
      if (start) range.$gte = new Date(start);
      if (end) range.$lte = new Date(end);
      return Object.keys(range).length ? range : null;
    };

    const sortField = allowedSortFields.includes(req.query.sortField)
      ? req.query.sortField
      : "creationDate";

    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

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
        .sort({ [sortField]: sortOrder })
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

export const getSalesReports = async (req, res) => {
  try {
    const { sellerName } = req.query;
    const matchStage = {};

    if (sellerName) {
      matchStage.sellerName = sellerName;
    }

    const report = await MonthlySales.aggregate([
      { $match: matchStage },

      {
        $facet: {
          totalAnnual: [
            {
              $group: {
                _id: { year: "$year", sellerName: "$sellerName" },
                totalAnnualSold: { $sum: "$totalSold" },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                sellerName: "$_id.sellerName",
                totalAnnualSold: { $round: ["$totalAnnualSold", 2] },
              },
            },
            { $sort: { year: 1, sellerName: 1 } },
          ],

          avgMonthly: [
            {
              $group: {
                _id: { year: "$year", sellerName: "$sellerName" },
                avgMonthlySold: { $avg: "$totalSold" },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                sellerName: "$_id.sellerName",
                avgMonthlySold: { $round: ["$avgMonthlySold", 2] },
              },
            },
            { $sort: { year: 1, sellerName: 1 } },
          ],

          bestMonth: [
            {
              $group: {
                _id: {
                  year: "$year",
                  month: "$month",
                  sellerName: "$sellerName",
                },
                totalSold: { $sum: "$totalSold" },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                sellerName: "$_id.sellerName",
                totalSold: { $round: ["$totalSold", 2] },
              },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 1 },
          ],
        },
      },
    ]);

    res.json({
      success: true,
      data: report[0],
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
      return res.status(404).json({ error: `Sale ${req.params.id} not found` });
    }
    res.json({ message: `Sale ID ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAllSales = async (req, res) => {
  try {
    const sale = await MonthlySales.deleteMany();
    console.log(sale);
    if (sale.deletedCount < 1) {
      return res.status(404).json({ error: "No sales found to delete" });
    }
    res.json({ message: `All sales deleted` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
