import mongoose from "mongoose";

const monthlySalesSchema = new mongoose.Schema({
    totalSold: Number,
    month: Number
});

export default mongoose.model("monthlySales", monthlySalesSchema);