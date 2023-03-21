import mongoose from "mongoose";

let todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum : ['High','Medium',"Low"],
        required: true,
    },
    dueDate: {
        type: Date,
        required: true, 
    },
    done: {
        type: Boolean,
        required:true
    },
    createdAt: {
        type: Date, 
        default: Date.now, 
        select: false 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now, 
        select: false 
    },
    __v: { type: Number, select: false }
},
{
    timestamps:true
});

let todoCollection = mongoose.models.todoCollection || mongoose.model("todoCollection", todoSchema);

export default todoCollection;