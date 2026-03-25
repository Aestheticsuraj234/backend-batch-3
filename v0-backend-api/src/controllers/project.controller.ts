import {Request , Response} from "express";
import {db} from "../db/index.js"
import { message, project } from "../db/schema.js";
import { randomUUID } from "node:crypto";
import { generateSlug } from "random-word-slugs";


export const createProject = async(req:Request , res:Response)=>{
    const {content} = req.body;

    // @ts-ignore
    const userId = req.user.id;

    const [newProject] = await db.insert(project).values({
        id:randomUUID(),
        name:generateSlug(),
        userId
    }).returning()

    await db.insert(message).values({
        id:randomUUID(),
        content,
        role:"USER",
        type:"RESULT",
        projectId:newProject.id
    });

    // todo: background job trigger

    return res.status(201).json(newProject)
}