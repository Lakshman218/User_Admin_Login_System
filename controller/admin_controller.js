const adminCollection = require("../models/admin_schema");
const userCollection = require("../models/user_schema");

//checking the admin session is existing
module.exports.getAdminRoute = async (req, res) => {
  if (req.session.admin) {
    users = await userCollection.find({});
    res.render("adminDashboard", { users });
  } else {
    res.render("adminLogin");
  }
};

//checking entered deatils and database deatils of admin
module.exports.postAdminRoute = async (req, res) => {
  const data = await adminCollection.findOne({ email: req.body.email });
  const users = await userCollection.find({});
  if (data) {
    if (req.body.email !== data.email && req.body.password === data.password) {
      res.redirect("/admin");
      // res.render("adminLogin",{ subreddit: "incorrect email" });
    } else if (
      req.body.email === data.email &&
      req.body.password !== data.password
    ) {
      res.redirect("/admin");
      // res.render("adminLogin",{ subreddit: "incorrect password" });
    } else {
      if (
        req.body.email === data.email &&
        req.body.password === data.password
      ) {
        req.session.admin = req.body.email;
        res.render("adminDashboard", { users });
      }
    }
  } else {
    res.render("/");
  }
};

//for searching users in admin pannel using regex
module.exports.postSearchuser = async (req, res) => {
  const name = req.body.search;
  const regex = new RegExp(`^(${name})`, "i");
  const users = await userCollection.find({ email: { $regex: regex } }).exec();
  res.render("adminDashboard", { users });
};

//admin make updation on user deatils
module.exports.getUpdateUser = async (req, res) => {
  const id = req.query.id;
  const data = await userCollection.find({ _id: id });
  user = data[0];
  res.render("UpdateUser", { user });
};

//admin updating user updations
module.exports.postUpdateUser = async (req, res) => {
  const id = req.query.id;
  const data = await userCollection.updateOne(
    { _id: id },
    {
      $set: {
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname,
        password: req.body.password,
      },
    }
  );
  const users = await userCollection.find({});
  res.render("adminDashboard", { users });
};

//for deleting user
module.exports.getDeleteUser = async (req, res) => {
  const id = req.query.id;
  const data = await userCollection.deleteOne({ _id: id });
  const users = await userCollection.find({});
  res.render("adminDashboard", { users });
};

//going to signuup page
module.exports.getNewUser = (req, res) => {
  res.render("userSignup");
};

//add user to admindashboard
module.exports.postNewUser = (req, res) => {
  res.render("adminDashboard");
};

//admin logout
module.exports.getLogout = (req, res) => {
  req.session.admin = null;
  res.redirect("/admin");
};

//admin session handling
module.exports.getAdminDashboard = (req, res) => {
  if (req.session.admin) {
    res.render("adminDashboard");
  }
};
