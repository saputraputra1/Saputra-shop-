const fs = require("fs");
const path = require("path");
const multer = require("multer");

const DATA_PATH = path.join(__dirname, "..", "data", "kvision_orders.json");
const UPLOAD_PATH = path.join(__dirname, "..", "public", "bukti");

if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_PATH),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

function readOrders() {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH));
}

function writeOrders(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  upload,

  getOrders: (req, res) => {
    const orders = readOrders();
    res.json(orders);
  },

  newOrder: (req, res) => {
    const { idpel, paket, nama } = req.body;
    const bukti = req.file ? req.file.filename : "";

    const orders = readOrders();
    const newOrder = {
      id: Date.now(),
      nama,
      idpel,
      paket,
      harga: paket == "BROMO-01" ? 22000 : 25000,
      bukti,
      status: "Pending",
      waktu: new Date().toISOString()
    };
    orders.push(newOrder);
    writeOrders(orders);
    res.json({ success: true, message: "Pesanan berhasil dibuat." });
  },

  updateStatus: (req, res) => {
    const { id, status } = req.body;
    const orders = readOrders();
    const index = orders.findIndex(o => o.id == id);
    if (index === -1) return res.status(404).json({ error: "Order tidak ditemukan." });
    orders[index].status = status;
    writeOrders(orders);
    res.json({ success: true });
  }
};
