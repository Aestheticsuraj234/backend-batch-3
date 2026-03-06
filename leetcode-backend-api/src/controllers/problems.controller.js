import { UserRole } from "@prisma/client";

export const createProblem = async(req , res)=>{
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolutions
    } = req.body;

    if(req.user.role !== UserRole.ADMIN){
        return res.status(401).json({error:"Unauthorized"})
    }

    try {
        
    } catch (error) {
        
    }
}