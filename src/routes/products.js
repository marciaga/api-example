import express from 'express';
import Joi from '@hapi/joi';
import * as productService from '../services/product.js';
import { authorize } from '../modules/authorize.js';
import { roles } from '../modules/roles.js';

const router = express.Router();

const idSchema = Joi.object({
  id: Joi.string().length(24).required(),
});

const createSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required().precision(2),
  description: Joi.string().required(),
});

const updateSchema = Joi.object({
  _id: Joi.string().length(24).required(),
  name: Joi.string().required(),
  price: Joi.number().required().precision(2),
  description: Joi.string().required(),
  created_by: Joi.string().length(24).required(),
});

const getAll = async (req, res, next) => {
  try {
    const { app, user } = req;
    const { db } = app.locals;

    const result = await productService.getAll({ db, user });

    return res.json({ payload: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { app, user } = req;
    const { db } = app.locals;

    const { id } = req.params;

    const value = await idSchema.validateAsync({ id });

    const result = await productService.getById({ id: value.id, db, user });
    return res.json({ payload: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { app, body, user } = req;
    const { db } = app.locals;

    const value = await createSchema.validateAsync(body);

    const result = await productService.create({
      db,
      body: value,
      userId: user.sub,
    });

    return res.status(201).json({ payload: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { app, body, user } = req;
    const { db } = app.locals;

    const value = await updateSchema.validateAsync(body);

    const result = await productService.update({
      db,
      body: value,
      userId: user.sub,
    });

    return res.json({ payload: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { params, app } = req;
    const { db } = app.locals;

    const value = await idSchema.validateAsync(params);

    const result = await productService.deleteOne({
      db,
      id: value.id,
    });

    return res.json({ payload: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const productRoutes = () => {
  router.get('/', authorize(), getAll);

  router.get('/:id', authorize(), getById);

  router.post('/', authorize(roles.admin), create);

  router.put('/', authorize(roles.admin), update);

  router.delete('/:id', authorize(roles.admin), deleteOne);

  return {
    path: '/products',
    handlers: router,
  };
};
