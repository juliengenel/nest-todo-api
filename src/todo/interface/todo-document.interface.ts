import { Document } from 'mongoose';
import { Task } from '../../task/models/task.schema';

export interface TodoDoc extends Document {
  title: string;
  tasks: Task[];
  date: string;
}
