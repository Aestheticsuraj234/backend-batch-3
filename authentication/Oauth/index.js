import express from 'express';
import dotenv from 'dotenv';
import authRouter from './auth.js';

dotenv.config();


const app = express();


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`<a href="/auth/google">Login with Google</a>`);
});

app.use("/auth" , authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});