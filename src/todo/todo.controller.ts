import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './models/todo.schema';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  getTodos(): Promise<Todo[]> {
    return this.todoService.getAll();
  }

  @Get(':id')
  getTodoById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getById(id);
  }

  @Patch()
  updateTodo(@Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todoService.update(updateTodoDto);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
