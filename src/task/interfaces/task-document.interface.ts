import { Document } from 'mongoose';

export interface TaskDoc extends Document {
  name: string;
  completed: boolean;
}
