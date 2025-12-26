export const authMiddleware = (req , res , next)=>{
    if(req.session && req.session.user){
        return next();
    }

    res.status(401).json({message:"Unauthorized"});
}