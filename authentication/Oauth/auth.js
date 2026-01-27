import { Router } from "express";
import { config } from "./config.js";

const authRouter = Router();

const stateStore = new Set();

// step-1
authRouter.get("/google", (req, res) => {
  const state = crypto.randomUUID();
  stateStore.add(state);

  const params = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: config.google.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// step-2
authRouter.get("/google/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state || !stateStore.has(state)) {
    return res.status(400).send("Invalid OAuth request");
  }

  stateStore.delete(state);

  // step-3 Exchange code for token;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: config.google.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const token = await tokenRes.json();

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo" , {
    headers:{
        Authorization : `Bearer ${token.access_token}`
    }
  })

   const user = await userRes.json()

//    db call

  res.send({
    message: "User authenticated",
    user
  });
});

export default authRouter;
