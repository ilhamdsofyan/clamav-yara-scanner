const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
