import express from "express";
import session from 'express-session';
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

import authRoutes from "./routes/auth.routes.js"

dotenv.config()

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            collectionName: "sessions",
            ttl: 24 * 60 * 60 
        }),
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, 
            httpOnly: true,
            sameSite: "strict"
        }
    })
);


app.use("/api/auth" , authRoutes)

