const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./routes/authroute");
const spotroutes = require("./routes/spotroute")
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/spots",spotroutes)

app.get('/', (req, res) => {
    res.send('Foodgram backend is running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});