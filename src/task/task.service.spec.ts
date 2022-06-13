import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Task } from './interfaces/task.interface';
import { createMock } from '@golevelup/ts-jest';
import { TaskDoc } from './interfaces/task-document.interface';
import { Model, Query } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

const mockTask = (name?: 'test', completed?: false, _id?: 'a uuid'): Task => ({
  name,
  completed,
  _id,
});

const mockTaskDoc = (mock?: Partial<Task>): Partial<TaskDoc> => ({
  name: mock?.name || 'test',
  completed: mock?.completed || false,
  _id: mock?._id || 'a uuid',
});

const taskArray = [
  mockTask('test', false, 'a uuid'),
  mockTask('test', false, 'a uuid'),
];

const taskDocArray = [
  mockTaskDoc({ name: 'test', completed: false, _id: 'a uuid' }),
  mockTaskDoc({ name: 'test', completed: false, _id: 'a uuid' }),
];

describe('TaskService', () => {
  let service: TaskService;
  let model: Model<TaskDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTask()),
            constructor: jest.fn().mockResolvedValue(mockTask()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    model = module.get<Model<TaskDoc>>(getModelToken('Task'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // properly allowing for us to successfully test them.
  it('should return all tasks', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(taskDocArray),
    } as any);
    const cats = await service.getAll();
    expect(cats).toEqual(taskArray);
  });

  it('should getOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<TaskDoc, TaskDoc>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(
            mockTaskDoc({ name: 'test', completed: false }),
          ),
      }) as any,
    );
    const findMockTask = mockTask('test', false, 'a uuid');
    const foundCat = await service.getById('a uuid');
    expect(foundCat).toEqual(findMockTask);
  });

  it('should insert a new task', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        _id: 'a uuid',
        name: 'test',
        completed: false,
      }),
    );
    const newTask = await service.create({
      name: 'test',
      completed: false,
    });
    expect(newTask).toEqual(mockTask('test', false, 'a uuid'));
  });

  it('should delete a task successfully', async () => {
    jest.spyOn(model, 'remove').mockResolvedValueOnce(true as any);
    expect(await service.remove('a bad id')).toEqual({ deleted: true });
  });
});
