export const Login = (req , res)=>{

    const {username} = req.body;

    if(!username){
        res.status(400).json({
            message:"Username is required"
        })
    }

    req.session.user = {username};

    res.cookie("username" , username , {httpOnly:true , maxAge: 1000 * 60 * 60 * 24});

    res.json({
        message:"User logged in successfully",
        username:username
    })
}

export const Logout = (req , res)=>{
    res.clearCookie("username");
    res.session.destroy();
    res.json({
        message:"User logged out successfully"
    })
}