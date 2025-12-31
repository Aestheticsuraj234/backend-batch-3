import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routers/auth.routes.js';
import taskRoutes from './routers/task.routes.js';


const app = express();
app.use(express.json())
app.use(cookieParser("codebysuraj"));

app.use(
  session(
    {
      secret: "mysecret",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24
      }
    }
  ))

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/task" , taskRoutes)


 

app.listen(3000, () => {
  console.log("Hello server is up")
})