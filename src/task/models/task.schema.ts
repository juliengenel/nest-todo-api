import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  name: string;

  @Prop()
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
