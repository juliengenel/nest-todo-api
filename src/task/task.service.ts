import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './models/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return await createdTask.save();
  }

  getAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  getById(id: string): Promise<Task> {
    return this.taskModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.taskModel.findOneAndUpdate({ _id: id }, updateTaskDto).exec();
  }

  remove(id: string) {
    return this.taskModel.deleteOne({ _id: id }).exec();
  }
}
