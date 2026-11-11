import mongoose, { Schema, model } from "mongoose";



const taskSchema = new Schema({
    title: { type: String, required: true },
    done: { type: Boolean,},
    userId: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });


export const TaskModel = model('Task', taskSchema); 