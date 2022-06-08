import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Task } from '../../task/models/task.schema';
import mongoose from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop()
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks: Task[];

  @Prop()
  date: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
