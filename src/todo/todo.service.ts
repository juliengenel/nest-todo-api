import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './models/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return await createdTodo.save();
  }

  getAll(): Promise<Todo[]> {
    return this.todoModel.find().populate('tasks').exec();
  }

  getById(id: string): Promise<Todo> {
    return this.todoModel.findOne({ _id: id }).populate('tasks').exec();
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    return this.todoModel
      .findOneAndUpdate({ _id: id }, updateTodoDto)
      .populate('tasks')
      .exec();
  }

  remove(id: string) {
    return this.todoModel.deleteOne({ _id: id }).exec();
  }
}
