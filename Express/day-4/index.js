import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";

const app = express();

app.use(cookieParser("suraj"));
app.use(
  session({
    secret: "mysecretkey",
    saveUninitialized: false, //read about this option (what it does),
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  res.send("Hello, World!");
});

app.get("/login" , (req , res)=>{
  req.session.user = {
    name: "Suraj",
    email:"sigmadev234@gmail.com",
    age:21 
  }

  res.json({
    message: "User logged in",
    user: req.session.user
  })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
