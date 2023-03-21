import connectDB from "@/database/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllTodoData, postTodoData } from "@/services/api.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    try {
        switch( req.method ){
            case "GET": 
                await getAllTodoData(req,res)
                break;
            
            case "POST": 
                await postTodoData(req,res)
                break;
        
            default:
                res.status(404).send({message:"Request Method Not found"})
                break;
        }
    }catch (err) {
        res.status(400).send({message:(err as Error).message});
    }
}



