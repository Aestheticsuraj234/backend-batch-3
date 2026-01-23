export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  return res.status(401).json({
    error: "Unauthorized - Please login first",
  });
};


export const logger = (req , res , next)=>{
    console.log(req.url);

    next()
}