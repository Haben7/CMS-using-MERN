require('dotenv').config({path: "./.env"});
const express = require('express');
const morgan = require('morgan');

const connectDB = require('./config/db');
const auth = require("./middlewares/auth")
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("tiny"));

//routes
app.get("/protected", auth, (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});
app.use("/api", require("./routes/auth"))

//server config
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`server listening on port: ${PORT}`);
}); 