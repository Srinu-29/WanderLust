const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser("secretcode"));
app.use(
  session({
    secret: "supersecretstring",
    resave: false,
    saveUninitialized: true,
  }),
);

app.get("/test", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`number of requests ${req.session.count}`);
});

app.get("/", (req, res) => {
  res.send("This is root path");
});

app.get("/verify", (req, res) => {
  console.log(req.signedCookies);
  res.send("verified");
});

app.get("/user", (req, res) => {
  let { greet = "Namaste", madeIn = "India" } = req.cookies;
  res.send(`${greet} in ${madeIn}`);
});

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("madeIn", "India", { signed: true });
//   res.send("Sent a signed cookie");
// });

// app.get("/getCookies", (req, res) => {
//   res.cookie("greet", "Namaste");
//   res.cookie("madeIn", "India");
//   console.log(req.cookies);
//   res.send("This is Cookie page");
// });

app.listen(3000, () => {
  console.log("port 3000 started listening");
});
