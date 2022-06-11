import { Task } from '../../task/models/task.schema';

export class UpdateTodoDto {
  title?: string;
  tasks?: Task[];
  date?: string;
}
