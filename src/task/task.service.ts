import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './models/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { dateStr } from '../dateConfig';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const createdTask = await this.taskModel.create(createTaskDto as any);
    return {
      _id: createdTask._id,
      name: createdTask.name,
      completed: createdTask.completed,
      Returned_At: dateStr,
    };
  }

  async getAll() {
    const tasks = await this.taskModel.find().exec();
    const taskmap = tasks.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      completed: doc.completed,
    }));
    return { ...taskmap, Returned_At: dateStr };
  }

  async getById(id: string) {
    const task = await this.taskModel.findOne({ _id: id }).exec();
    return {
      _id: task._id,
      name: task.name,
      completed: task.completed,
      Returned_At: dateStr,
    };
  }

  async update(updateTaskDto: UpdateTaskDto) {
    const { _id } = updateTaskDto;
    const foundTask = await this.taskModel
      .findOneAndUpdate({ _id }, updateTaskDto)
      .exec();
    return {
      id: foundTask._id,
      name: foundTask.name,
      completed: foundTask.completed,
      Returned_At: dateStr,
    };
  }

  async remove(id: string) {
    try {
      await this.taskModel.remove({ id });
      return {
        deleted: true,
        Returned_At: dateStr,
      };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
