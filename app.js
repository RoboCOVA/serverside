const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

connectDB();

const app = express();

//Middlewares
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

//Routes
app.use("/users", require("./routes/authRoutes"));
app.use("/home", require("./routes/AccessRoutes"));
app.use("/post", require("./routes/PostRoutes"));
app.use("/profile", require("./routes/ProfileRoutes"));
app.use("/user", require("./routes/UserRoutes"));
app.use("/category", require("./routes/GroupRoutes"));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port);
console.log("Server listening at " + port);
