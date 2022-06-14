import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './models/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { dateStr } from '../dateConfig';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return await createdTodo.save();
  }

  async getAll() {
    const todos = await this.todoModel.find().populate('tasks').exec();
    const todosMap = todos.map((doc) => ({
      _id: doc._id,
      title: doc.title,
      tasks: doc.tasks,
      date: doc.date,
    }));
    return { ...todosMap, Returned_At: dateStr };
  }

  async getById(id: string) {
    const todo = await this.todoModel
      .findOne({ _id: id })
      .populate('tasks')
      .exec();
    return {
      _id: todo._id,
      title: todo.title,
      tasks: todo.tasks,
      date: todo.date,
      Returned_At: dateStr,
    };
  }

  async update(updateTodoDto: UpdateTodoDto) {
    const { _id } = updateTodoDto;
    const todoToUpdate = await this.todoModel
      .findOneAndUpdate({ _id }, updateTodoDto)
      .populate('tasks')
      .exec();
    return {
      id: todoToUpdate._id,
      title: todoToUpdate.title,
      tasks: todoToUpdate.tasks,
      date: todoToUpdate.date,
      Returned_At: dateStr,
    };
  }

  async remove(id: string) {
    try {
      await this.todoModel.remove({ id });
      return {
        deleted: true,
        Returned_At: dateStr,
      };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
