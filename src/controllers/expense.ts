import { Response, Request } from 'express';
import Expense, { ExpenseModel } from '../models/Expense';
import Category, { CategoryModel } from '../models/Category';
import { Expense as IExpense } from '../types/expense';
import { handleError } from '../_common/error-handler';

export const getExpenseList = async (req: Request, res: Response) => {
  try {
    return res.json(await Expense.find());
  } catch (err) {
    handleError({err, res});
  }
};

export const getSingleExpense = async (req: Request, res: Response) => {
  try {
    return res.json(await Expense.findById(req.params.id));
  } catch (err) {
    handleError({err, res});
  }
};

export const deleteSingleExpense = async (req: Request, res: Response) => {
  try {
    await Expense.findByIdAndRemove(req.params.id);
    return res.status(200).end();
  } catch (err) {
    handleError({err, res});
  }
};

export const createExpense = async (req: Request, res: Response) => {
  const body: {
    amount: number;
    category: string;
    note: string;
  } = req.body;

  const expense: IExpense = {
    amount: body.amount,
    category: undefined,
    note: body.note,
    createdBy: req.user._id,
  };

  try {
    const foundCat: CategoryModel = await Category.findOne({ name: body.category });

    if (foundCat) {
      expense.category = foundCat._id;
    } else {
      const newCat: CategoryModel = await Category.create({ name: body.category });
      expense.category = newCat._id;
    }

    await Expense.create(expense);
    return res.status(200).end();
  } catch (err) {
    handleError({err, res});
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const body: {
    amount: number;
    category: string;
    note: string;
  } = req.body;

  try {
    const foundExpense: ExpenseModel = await Expense.findById(req.params.id);

    foundExpense.amount = body.amount;
    foundExpense.note = body.note;

    const foundCat: CategoryModel = await Category.findOne({ name: body.category });

    if (!foundCat || foundCat.name !== body.category) {
      const newCat: CategoryModel = await Category.create({ name: body.category });
      foundExpense.category = newCat._id;
    }

    await foundExpense.save();
    return res.status(200).end();
  } catch (err) {
    handleError({err, res});
  }
};
