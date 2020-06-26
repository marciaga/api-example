import express from 'express';
import Joi from '@hapi/joi';

import * as userService from '../services/user.js';
import { authorize } from '../modules/authorize.js';
import { roles } from '../modules/roles.js';

const router = express.Router();
/*
const schema = {
  _id,
  username,
  password,
  name,
  lastname,
  age,
  role,
};
*/

const idSchema = Joi.object({
  id: Joi.string().length(24).required(),
});

const authenticateSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});

const authenticate = async (req, res, next) => {
  try {
    const value = await authenticateSchema.validateAsync(req.body);

    const result = await userService.authenticate({
      ...value,
      db: req.app.locals.db,
    });

    if (!Object.keys(result).length) {
      return res.status(400).json({ message: 'invalid credentials' });
    }

    return res.json({ payload: result });
  } catch (error) {
    console.log('error: ', error);
    return next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { db } = req.app.locals;
    const result = await userService.getAll({ db });
    return res.json({ payload: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { db } = req.app.locals;
    const { id } = req.params;

    const value = await idSchema.validateAsync({ id });

    const result = await userService.getById({ id: value.id, db });
    return res.json({ payload: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const userRoutes = () => {
  router.get('/', authorize(roles.admin), getAll);

  router.get('/:id', authorize(), getById);

  router.post('/authenticate', authenticate);

  return {
    path: '/users',
    handlers: router,
  };
};
