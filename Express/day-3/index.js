import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));

// How to you can set cookies

app.get("/set-cookie", (req, res) => {
  res.cookie("name", "suraj", {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    signed: true, // signed cookie
    httpOnly: true, // can't be accessed by JS
    secure: true, // HTTPS only
    path: "/", // URL path where cookie is accessible
    sameSite: "lax", // CSRF protection // assignment
  });

  res.send("Cookie has been set!");
});

app.get("/read-cookie", (req, res) => {
  // const rawCookies = req.headers.cookie; bad approach
  const parsedCookie = req.cookies.theme;
  console.log(req.signedCookies);

  res.json({
    data: req.signedCookies,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


