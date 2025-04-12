const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./routes/authroute");
const userroute = require("./routes/userroute");
const adminroute = require("./routes/adminroute");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/api/auth",authRoutes)
app.use("/api/user",userroute)
app.use("/api/admin",adminroute)

app.get('/', (req, res) => {
    res.send('Foodgram backend is running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});