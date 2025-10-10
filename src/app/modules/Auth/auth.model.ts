import { Schema } from 'mongoose';
import { TUser } from './auth.interface';

const userScema = new Schema<TUser>({
  name: {
    type: 'String',
    required: true,
  },
  email: {
    type: 'String',
    required: true,
    unique: true,
  },
  password: {
    type: 'String',
    required: true,
    select: 0,
  },
  phone: {
    type: 'String',
    required: true,
  },
  role: {
    type: 'String',
    enum: ['user', 'donor', 'admin'],
    default: 'user',
  },
  passwordChangedAt: {
    type: Date,
  },
});
