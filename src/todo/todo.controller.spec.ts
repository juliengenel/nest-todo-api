import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              {
                title: 'test todo',
                tasks: [
                  { name: 'tesk task', completed: false },
                  { name: 'tesk task1', completed: false },
                ],
                date: 'date',
              },
              {
                title: 'test todo1',
                tasks: [
                  { name: 'tesk task2', completed: false },
                  { name: 'tesk task3', completed: false },
                ],
                date: 'date1',
              },
            ]),
            create: jest
              .fn()
              .mockImplementation((todo: CreateTodoDto) =>
                Promise.resolve({ _id: 'a uuid', ...todo }),
              ),
            getById: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                title: 'test todo',
                tasks: [
                  { name: 'tesk task2', completed: false },
                  { name: 'tesk task3', completed: false },
                ],
                date: 'date1',
                _id: id,
              }),
            ),
            update: jest
              .fn()
              .mockImplementation((todo: UpdateTodoDto) =>
                Promise.resolve({ _id: 'a uuid', ...todo }),
              ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTodos', () => {
    it('should get an array of todos', () => {
      expect(controller.getTodos()).resolves.toEqual([
        {
          title: 'test todo',
          tasks: [
            { name: 'tesk task', completed: false },
            { name: 'tesk task1', completed: false },
          ],
          date: 'date',
        },
        {
          title: 'test todo1',
          tasks: [
            { name: 'tesk task2', completed: false },
            { name: 'tesk task3', completed: false },
          ],
          date: 'date1',
        },
      ]);
    });
  });

  describe('create todo', () => {
    it('should create a new todo', () => {
      const createTodoDoto: CreateTodoDto = {
        title: 'teste todo',
        tasks: [],
        date: 'test',
      };
      expect(controller.createTodo(createTodoDoto)).resolves.toEqual({
        _id: 'a uuid',
        ...createTodoDoto,
      });
    });
  });

  describe('getById', () => {
    it('should get a single todo', () => {
      expect(controller.getTodoById('a strange id')).resolves.toEqual({
        title: 'test todo',
        tasks: [
          { name: 'tesk task2', completed: false },
          { name: 'tesk task3', completed: false },
        ],
        date: 'date1',
        _id: 'a strange id',
      });
    });
  });
});
