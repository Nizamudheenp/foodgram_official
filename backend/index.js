const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db')

const authRoutes = require("./routes/authroute");
const userroute = require("./routes/userroute");
const adminroute = require("./routes/adminroute");
connectDB()
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ["http://127.0.0.1:5500",
        process.env.FRONTEND_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}))


app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes)
app.use("/api/user", userroute)
app.use("/api/admin", adminroute)

app.get('/', (req, res) => {
    res.send('Foodgram backend is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

