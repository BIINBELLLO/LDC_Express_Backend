const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

// Init Middleware so we can have access to request body for every route

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Routes definition

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5700;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
