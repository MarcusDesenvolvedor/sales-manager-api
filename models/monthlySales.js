import mongoose from "mongoose";

const monthlySalesSchema = new mongoose.Schema({
  sellerName: String,
  totalSold: {
    type: Number,
    min: 0.01,
    set: (v) => Math.round(v * 100) / 100,
  },
  month: String,
  year: Number,
  creationDate: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastChange: {
    type: Date,
    default: Date.now,
  },
  additionalSellerInformation: [
    {
      email: String,
      country: String,
      state: String,
      city: String,
      document: { type: String, immutable: true },
      birthDate: {
        type: Date,
        set: (val) => {
          if (val) {
            const date = new Date(val);
            date.setHours(0, 0, 0, 0);
            return date;
          }
          return val;
        },
        immutable: true,
      },
    },
  ],
});

export default mongoose.model("monthlySales", monthlySalesSchema);
