const User = require("../models/User");
const invalidCredentials = require("../utils/validation");

const bcrypt = require("bcryptjs");

function getSignup(req, res) {
  res.render("customer/auth/signup");
}

async function signup(req, res, next) {
  const { email, confirmEmail, password, fullname, street, pincode, city } =
    req.body;

  req.session.details = {
    email,
    confirmEmail,
    password,
    fullname,
    street,
    pincode,
    city,
  };

  if (email !== confirmEmail) {
    req.session.error_msg =
      "Entered email and entered confirm email are not same!!!";
    return res.redirect("/signup");
  } else if (
    invalidCredentials(email, password, fullname, street, pincode, city)
  ) {
    req.session.error_msg = "Entered credentials contains some error!!!";
    return res.redirect("/signup");
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.error_msg = "Email already registered!!!";
      return res.redirect("/signup");
    }

    // Create a new user
    const address = { street, pincode, city };
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      name: fullname,
      address,
    });

    await newUser.save();

    // After successful signup, set success message and redirect
    req.session.success_msg = "Signup Successful!!!";
    return res.redirect("/signup");
  } catch (error) {
    next(error);
  }
}

function getLogin(req, res) {
  res.render("customer/auth/login");
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      req.session.error_msg = "User does not exist!!!";
      return res.redirect("/login");
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.session.error_msg = "Invalid Password!!!";
      return res.redirect("/login");
    }

    // If valid, create session and login
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;
    req.session.save(() => {
      if (user.isAdmin) {
        return res.redirect("/admin/products");
      }
      return res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res, next) {
  req.session.uid = null;
  req.session.isAuth = null;
  if (req.session.isAdmin) {
    req.session.isAdmin = null;
  }
  res.redirect("/");
}

module.exports = { getSignup, signup, getLogin, login, logout };
