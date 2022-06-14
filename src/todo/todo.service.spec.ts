import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Todo } from './interface/todo.interface';
import { TodoDoc } from './interface/todo-document.interface';
import { Model, Query, Schema } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { TaskDoc } from '../task/interfaces/task-document.interface';
import { createMock } from '@golevelup/ts-jest';
import { dateStr } from '../dateConfig';

const mockTodo = (
  title?: 'test',
  tasks?: [],
  date?: '',
  _id?: 'a uuid',
): Todo => ({
  title,
  tasks,
  date,
  _id,
});

const mockTodoDoc = (mock?: Partial<Todo>): Partial<TodoDoc> => ({
  title: mock?.title || 'test',
  tasks: mock?.tasks || [],
  date: mock?.date || 'test',
  _id: mock?._id || 'a uuid',
});

const todoArray = [
  mockTodo('test', [], '', 'a uuid'),
  mockTodo('test', [], '', 'a uuid'),
];

const todoDocArray = [
  mockTodoDoc({ title: 'test', tasks: [], date: 'test', _id: 'a uuid' }),
  mockTodoDoc({ title: 'test', tasks: [], date: 'test', _id: 'a uuid' }),
];

describe('TodoService', () => {
  let service: TodoService;
  let model: Model<TodoDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken('Todo'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTodo()),
            constructor: jest.fn().mockResolvedValue(mockTodo()),
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

    service = module.get<TodoService>(TodoService);
    model = module.get<Model<TodoDoc>>(getModelToken('Todo'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all todo', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(todoDocArray),
    } as any);
    const tasks = await service.getAll();
    expect(tasks).toEqual({ ...todoArray, Returned_At: dateStr });
  });

  it('should getOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<TaskDoc, TaskDoc>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(
            mockTodoDoc({ title: 'test', tasks: [], date: '' }),
          ),
      }) as any,
    );
    const findMocktodp = mockTodo('test', [], '');
    const foundTodo = await service.getById('a uuid');
    expect(foundTodo).toEqual({ ...findMocktodp, Returned_At: dateStr });
  });

  it('should not delete a todo', async () => {
    // really just returning a falsy value here as we aren't doing any logic with the return
    jest.spyOn(model, 'remove').mockRejectedValueOnce(new Error('Bad delete'));
    expect(await service.remove('a bad id')).toEqual({
      deleted: false,
      message: 'Bad delete',
    });
  });
});
