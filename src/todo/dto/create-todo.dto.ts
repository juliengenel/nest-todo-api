import { Task } from '../../task/models/task.schema';

export class CreateTodoDto {
  readonly title: string;
  readonly tasks: Task[];
  readonly date: string;
}
