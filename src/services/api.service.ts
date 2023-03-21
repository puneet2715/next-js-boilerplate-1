import todoCollection from "@/database/todoSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { validationChecks } from "@/utils/checks";
import { todoFields } from "@/types/todo.type";
import mongoose from "mongoose";

export const getAllTodoData = async (req: NextApiRequest, res: NextApiResponse) => {
    const { priority, isFinished, dueDate } = req.query;
    const todayDate = new Date().setHours(0,0,0,0);
    const filters = {
        ...(priority !== undefined) && {priority},
        dueDate: dueDate !== undefined ? {$gte: todayDate, $lte: dueDate} : {$gte: todayDate},
        done: isFinished !== undefined? isFinished : false
    }
    const todoData = await todoCollection.find(filters).sort({dueDate:1})
    res.status(200).send(todoData)
}

export const postTodoData = async (req: NextApiRequest, res: NextApiResponse) => {
    const { task, priority, dueDate, done}: todoFields = req.body;

    let validationErrors = validationChecks({ task, priority, dueDate, done});
    if ( validationErrors !== '' ){
        res.status(400).send({message:"Fix following issues: "+validationErrors})
        return;
    }

    const sameTodoData = await todoCollection.find({task, dueDate}).exec()
    if ( sameTodoData.length > 0 ){
        res.status(400).send({message:"Same Todo Data already exists"})
        return;
    }

    const todoData = new todoCollection({task, priority, dueDate , done})
    const saveResponse = await todoData.save();
    const dataResponse = await todoCollection.findById({_id:saveResponse._id})
    res.status(201).send(dataResponse)
}

export const getTodoById = async (req: NextApiRequest, res: NextApiResponse, _id: mongoose.Types.ObjectId )=>{
    const todoData = await todoCollection.findById({_id})
    res.status(200).send(todoData)
}

export const updateTodoById = async (req: NextApiRequest, res: NextApiResponse, _id: mongoose.Types.ObjectId) => {
    let response = await todoCollection.findOneAndUpdate({_id},req.body,{new:true});
    res.status(200).send(response);
}

export const deleteTodoById = async (req: NextApiRequest, res: NextApiResponse, _id: mongoose.Types.ObjectId) => {
    await todoCollection.deleteOne({_id});
    res.status(200).send({
        message:"Data deleted succesfully!"
    })
}

