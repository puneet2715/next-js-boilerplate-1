import connectDB from "@/database/db";
import { Types } from "mongoose";
import { deleteTodoById, getTodoById, updateTodoById } from "@/services/api.service";
import { NextApiRequest, NextApiResponse } from "next";
import { isIdValid } from "@/utils/checks";

export default async function app(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    try {
        let id = req.query.id!.toString()
        if ( ! await isIdValid(id) ){
            res.status(404).send({message:"Todo Data with given id cannot be found!"})
            return;
        }
        const _id = new Types.ObjectId(id)

        switch ( req.method ){
            case "GET": 
                await getTodoById(req, res, _id)
                break;

            case "PUT": 
                await updateTodoById(req, res, _id)
                break;

            case "DELETE": 
                await deleteTodoById(req, res, _id)
                break;

            default:
                res.status(404).send({message:"Request Method Not found"})
                break;
        }
    } catch (err) {
        res.status(400).send({message: (err as Error).message});
    }
}