const cookieParser = require("cookie-parser");
const session = require("express-session");
const express = require("express");
require("dotenv").config();
const connectDB = require("./utils/mongodbUtil");
const MongoStore = require("connect-mongo");

const { homeRouter } = require("./routes/homeRoute");
const { registerRouter } = require("./routes/registerRoute");
const { loginRoter } = require("./routes/loginRoute");
const { dashboardRouter } = require("./routes/dashboardRoute");
const { logoutRouter } = require("./routes/logoutRoute");
const { secretRouter } = require("./routes/secretRoute");

const { adminRouter } = require("./routes/adminRoute");
const { usersRouter } = require("./routes/usersRoute");
const imageRouter = require("./routes/imageRoute");
const { sessionHandler } = require("./middlewares/sessionMiddleware");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  session({
    secret: "the secret key",
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI_Cluster,
      ttl: 14 * 24 * 60 * 60, // Session expiration in seconds (14 days)
    }),
    cookie: { secure: true, maxAge: 6000000 },
  })
);
//Routes:

app.use(homeRouter);
app.use(registerRouter);
app.use(loginRoter);
app.use(dashboardRouter);
app.use(logoutRouter);
app.use(secretRouter);
app.use(adminRouter);
app.use(sessionHandler, usersRouter);
app.use(imageRouter);

app.use((req, res) => {
  res.send({ message: "page not found" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`App is listening at: http://localhost:${PORT}`);
});
