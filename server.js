const express = require("express");
const app = express();

const userRoute = require("./routers/login");
const bookRoute = require("./routers/library");
const authRoute = require("./routers/users");

const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use("/api/login", userRoute);
app.use("/api/library", bookRoute);
app.use("/api/users", authRoute);


app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));


