import { Task } from '../../task/models/task.schema';

export interface Todo {
  title?: string;
  tasks?: Task[];
  date?: string;
  _id?: string;
}
