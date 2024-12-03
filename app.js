require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const csurf = require("csurf");
const MongoStore = require("connect-mongo");

const Cart = require("./models/Cart");

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.static("products-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const MONGODB_COMICMART = process.env.MONGODB_COMICMART;
const PORT = process.env.PORT;

// MongoDB connection setup
mongoose
  .connect(MONGODB_COMICMART, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Session and store setup
app.use(
  session({
    secret: ")(*&^%$#@!", // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_COMICMART,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // Session expiration: 14 days
    }),
    cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }, // Cookie expiration: 2 days
  })
);

// CSRF protection
app.use(csurf());

// Middleware to set locals for flash messages and authentication state
app.use((req, res, next) => {
  // cart initialization
  if (!req.session.cart) {
    res.locals.cart = new Cart();
  } else {
    res.locals.cart = new Cart(
      req.session.cart.items,
      req.session.cart.totalQuantity,
      req.session.cart.totalPrice
    );
  }

  res.locals.csrfToken = req.csrfToken();

  // Flash messages
  res.locals.success_msg = req.session.success_msg;
  res.locals.error_msg = req.session.error_msg;
  delete req.session.success_msg;
  delete req.session.error_msg;

  // Persisting form data on error
  if (req.session.details) {
    res.locals.details = req.session.details;
    delete req.session.details;
  }

  // Authentication status
  if (req.session.uid) {
    res.locals.uid = req.session.uid;
    res.locals.isAuth = true;

    if (req.session.isAdmin) {
      res.locals.isAdmin = req.session.isAdmin;
    }
  }

  next();
});

// Routes
app.use(require("./routes/baseRoutes"));
app.use(
  "/cart",
  (req, res, next) => {
    if (res.locals.isAdmin) {
      const error = new Error("Not for Admin");
      error.status = 404;
      next(error);
    }
    next();
  },
  require("./routes/cartRoutes")
);
app.use(require("./routes/productRoutes"));
app.use(require("./routes/authRoutes"));
app.use(
  "/admin",
  (req, res, next) => {
    if (!res.locals.isAuth) return res.redirect("/401");
    if (!res.locals.isAdmin) return res.redirect("/403");
    next();
  },
  require("./routes/adminRoutes")
);
app.use("/orders", (req, res, next) => {
  if (!res.locals.isAuth || res.locals.isAdmin) {
    const error = new Error("Login with user accounts");
    error.status = 404;
    next(error);
  }
  next();
},require("./routes/orderRoutes"));

// // Catch-all route for
// app.use((req, res, next) => {
//   res.status(404).render("shared/404");
// });

// // Error handler
// app.use((error, req, res, next) => {
//   console.error("An error occurred:", error);
//   if (error.status === 404 || error.code === 404) {
//     res.status(404).render("shared/404");
//     return;
//   }
//   res.status(500).render("shared/500", { error });
// });

// Start the server
app.listen(3000, () => {
  console.log("Listening to http://localhost:" + PORT);
});
