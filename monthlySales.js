import mongoose from "mongoose";

const monthlySalesSchema = new mongoose.Schema({
    sellerName: String,
    totalSold: Number,
    month: String,
    year: Number

});

export default mongoose.model("monthlySales", monthlySalesSchema);