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
    const list = await Shoe.find()
    const mapped = list.map(doc => {
      const obj = doc.toObject()
      obj.id = obj._id // thêm id = _id
      return obj
    })
    res.json(mapped)
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" })
  }
})

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

// GET one by _id or id
app.get("/shoes/:id", async (req, res) => {
  const key = req.params.id
  try {
    const found = await Shoe.findById(key).catch(() => null) || await Shoe.findOne({ id: key })
    if (!found) return res.status(404).json({ error: "Không tìm thấy sản phẩm" })
    const obj = found.toObject()
    obj.id = obj._id
    res.json(obj)
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" })
  }
})

// PUT by _id or id
app.put("/shoes/:id", async (req, res) => {
  const key = req.params.id
  try {
    let updated = await Shoe.findByIdAndUpdate(key, req.body, { new: true }).catch(() => null)
    if (!updated) updated = await Shoe.findOneAndUpdate({ id: key }, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: "Không tìm thấy sản phẩm" })
    const obj = updated.toObject()
    obj.id = obj._id
    res.json(obj)
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi cập nhật sản phẩm" })
  }
})

// DELETE by _id or id
app.delete("/shoes/:id", async (req, res) => {
  const key = req.params.id
  try {
    let deleted = await Shoe.findByIdAndDelete(key).catch(() => null)
    if (!deleted) deleted = await Shoe.findOneAndDelete({ id: key })
    if (!deleted) return res.status(404).json({ error: "Không tìm thấy sản phẩm" })
    res.json({ message: "Đã xóa sản phẩm" })
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi xóa sản phẩm" })
  }
});


app.listen(4000, () => console.log(" API running on http://localhost:4000"));
