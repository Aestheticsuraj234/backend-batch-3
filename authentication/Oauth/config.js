import dotenv from 'dotenv';
dotenv.config();


export const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/auth/google/callback",
  },
}
