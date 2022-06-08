import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';
import { TaskModule } from './task/task.module';
import { DBUri } from './config';

@Module({
  imports: [MongooseModule.forRoot(DBUri), TodoModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
