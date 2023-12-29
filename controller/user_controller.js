const userCollection = require("../models/user_schema");

//checking login session avalibality
module.exports.getUserRoute = (req, res) => {
  if (req.session.user) {
    res.redirect("/user/userDashboard");
  } else {
    res.render("userLogin");
  }
};

//checking login deatils
module.exports.postLogin = async (req, res) => {
  const data = await userCollection.findOne({ email: req.body.email });
  if (data) {
    if (req.body.email !== data.email) {
      res.render("userLogin", { subreddit: "incorrect email" });
    } else if (req.body.password !== data.password) {
      res.render("userLogin", { subreddit: "incorrect password" });
    } else {
      if (req.body.email == data.email && req.body.password == data.password) {
        req.session.user = data.email;
        const user = req.session.user;
        res.render("userDashboard", { user });
      }
    }
  } else {
    res.redirect("/");
  }
};

//session handling to user dashboard
module.exports.getUserDashboard = (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    res.render("userDashboard", { user });
  }else{
    res.redirect("user")
  }
};

//logout session
module.exports.getUserLogout = (req, res) => {
  req.session.user = null;
  console.log(req.session);
  res.redirect("/user");
};

// user signup
module.exports.getUserSignup = (req, res) => {
  res.render("userSignup");
};

// checking email and create a new user
module.exports.postUserSignup = async (req, res) => {
  const data = await userCollection.findOne({ email: req.body.email });
  if (data) {
    res.render("userSignup", {
      error: "user with this email exist try with another email",
    });
  } else {
    await userCollection.create({
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      password: req.body.password,
    });
    req.session.admin=null;
    res.redirect("/");
  }
};
