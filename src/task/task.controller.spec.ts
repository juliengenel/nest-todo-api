import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              { name: 'task test', completed: false },
              { name: 'task test', completed: false },
            ]),
            create: jest
              .fn()
              .mockImplementation((task: CreateTaskDto) =>
                Promise.resolve({ _id: 'a uuid', ...task }),
              ),
            getById: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                name: 'task test',
                completed: false,
                _id: id,
              }),
            ),
            update: jest
              .fn()
              .mockImplementation((task: UpdateTaskDto) =>
                Promise.resolve({ _id: 'a uuid', ...task }),
              ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTasks', () => {
    it('should get an array of tasks', () => {
      expect(controller.getTasks()).resolves.toEqual([
        {
          name: 'task test',
          completed: false,
        },
        {
          name: 'task test',
          completed: false,
        },
      ]);
    });
  });

  describe('create task', () => {
    it('should create a new taks', () => {
      const createTaskDto: CreateTaskDto = {
        name: 'test task',
        completed: false,
      };
      expect(controller.createTask(createTaskDto)).resolves.toEqual({
        _id: 'a uuid',
        ...createTaskDto,
      });
    });
  });

  describe('getById', () => {
    it('should get a single task', () => {
      expect(controller.getTaskById('a strange id')).resolves.toEqual({
        name: 'task test',
        completed: false,
        _id: 'a strange id',
      });
    });
  });

  describe('updateTaks', () => {
    it('should update a task', () => {
      const updateTaskDto: UpdateTaskDto = {
        _id: 'a uuid',
        name: 'task test',
        completed: false,
      };
      expect(controller.updateTask(updateTaskDto)).resolves.toEqual({
        ...updateTaskDto,
        _id: 'a uuid',
      });
    });
  });
  describe('deleteTask', () => {
    it('should return that it deleted a taks', () => {
      expect(controller.deleteTask('a uuid that exists')).resolves.toEqual({
        deleted: true,
      });
    });
  });
});
