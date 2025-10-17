// Import required modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Currency Converter Backend is Running 💱");
});

// ✅ API route to convert currency
app.post("/api/convert", async (req, res) => {
  const { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Fetch live exchange rates
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const rate = response.data.rates[to];

    if (!rate) {
      return res.status(404).json({ error: "Currency not supported" });
    }

    const convertedAmount = (amount * rate).toFixed(2);

    res.json({
      from,
      to,
      rate,
      amount,
      convertedAmount,
      date: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching exchange rate" });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
