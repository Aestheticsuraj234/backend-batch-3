import {User} from "../models/User.model.js";

export const register = async (req , res)=>{
    try {
        const {username , email , password} = req.body;

        if(!username || !email || !password){
            return res.staus(400).json({errors:"Required all the fields "})
        }

        const existingUser = await User.findOne({
            $or:[{email} , {username}]
        })

         
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    const user = new User({username , email , password});
    await user.save()

    req.session.userId = user._id;

    res.status(201).json({
        message:"User registered successfully",
        user:user.toJSON()
    })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const login = async(req , res)=>{}

export const logout = async(req , res)=>{}


export const getCurrentUser = async(req , res)=>{}