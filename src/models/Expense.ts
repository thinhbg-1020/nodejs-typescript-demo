import mongoose from 'mongoose';
import { SchemaName } from '../config/constants';
import { Expense as IExpense } from '../types/expense';

const Schema = mongoose.Schema;

export type ExpenseModel = mongoose.Document & IExpense;

const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: SchemaName.Category,
  },
  note: {
    type: String,
    default: '',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date(),
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: SchemaName.User,
  },
});

const Expense = mongoose.model<ExpenseModel>('Expense', expenseSchema);

export default Expense;
