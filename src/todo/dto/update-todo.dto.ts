import { Task } from '../../task/models/task.schema';

export class UpdateTodoDto {
  _id: string;
  title?: string;
  tasks?: Task[];
  date?: string;
}
