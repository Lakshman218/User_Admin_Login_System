const express = require("express");
const mongoose = require("mongoose");
const nocache = require("nocache");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const app = express();

const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");

const PORT = 3000;
const LOCAL_STR ="mongodb://127.0.0.01:27017/useradmin"

app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views" / "./views");
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialise: false,
  })
);

app.use("/admin", adminRouter);
app.use("/user", userRouter);

const db = mongoose.connect(LOCAL_STR);

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/user/userDashboard");
  } else if (req.session.admin) {
    res.redirect("/admin/adminDashboard");
  } else {
    res.render("main");
  }
});

app.listen(PORT, async (req, res) => {
  await db;
  try {
    db.then((con_obj) => {
      console.log("DB connected");
    });
    db.catch((err) => {
      console.log("An error occured while connecting server");
    });
    console.log("SERVER STARTED");
    console.log(`http://localhost:${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
