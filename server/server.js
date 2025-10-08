import express from "express";
import mongoose from "mongoose";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/shoe_store');
console.log("Connected to MongoDB shoe_store");


const ShoeSchema = new mongoose.Schema(
  {
    productCode: String,
    productName: String,
    size: String,
    price: Number,
    quantity: Number,
    image: String,
    description: String,
  },
  { timestamps: true }
);

const Shoe = mongoose.model("Shoe", ShoeSchema);

app.get("/shoes", async (req, res) => {
  try {
    const list = await Shoe.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
  }
});

app.get("/shoes/:id", async (req, res) => {
  try {
    const item = await Shoe.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" });
  }
});


app.post("/shoes", async (req, res) => {
  try {
    const newShoe = new Shoe(req.body);
    const saved = await newShoe.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }
});


app.put("/shoes/:id", async (req, res) => {
  try {
    const updated = await Shoe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi cập nhật sản phẩm" });
  }
});

app.delete("/shoes/:id", async (req, res) => {
  try {
    const deleted = await Shoe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi xóa sản phẩm" });
  }
});


app.listen(4000, () => console.log(" API running on http://localhost:4000"));
