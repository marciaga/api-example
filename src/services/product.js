import mongodb from 'mongodb';
import { roles } from '../modules/roles.js';

/*
const product = {
  _id,
  name,
  price,
  description,
  created_by, //#id of the user who created this product
};
*/

const { ObjectID } = mongodb;
const collection = 'products';

const getProjectionMap = (user) => (user.role === roles.admin
  ? {} : { created_by: 0 });

export const getAll = async ({ db, user }) => {
  try {
    const col = db.collection(collection);
    const opts = {};

    opts.projection = getProjectionMap(user);

    const products = await col.find({}, opts).toArray();

    return products;
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};

export const getById = async ({ db, id, user }) => {
  try {
    const col = db.collection(collection);
    const opts = {};
    opts.projection = getProjectionMap(user);

    const product = await col.findOne({ _id: ObjectID(id) }, opts);

    return product;
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};

export const create = async ({ db, userId, body }) => {
  try {
    const col = db.collection(collection);
    const doc = {
      ...body,
      created_by: ObjectID(userId),
    };
    const opts = {};
    const queryResult = await col.insertOne(doc, opts);

    if (!queryResult.result.ok) {
      throw new Error('something went wrong, please try again.');
    }
    // ops is an array of documents that were inserted
    const { ops } = queryResult;
    // we only insert one document, so we can safely return the first here.
    const product = ops.slice(0, 1);

    return product;
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};

export const update = async ({ db, userId, body }) => {
  try {
    const col = db.collection(collection);
    const { _id, ...rest } = body;
    const filter = { _id: ObjectID(_id) };
    const doc = {
      ...rest,
      created_by: ObjectID(userId),
    };

    const queryResult = await col.updateOne(filter, { $set: doc });

    if (!queryResult.result.ok) {
      throw new Error('something went wrong, please try again.');
    }

    return {
      _id,
      ...doc,
    };
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};

export const deleteOne = async ({ db, id }) => {
  try {
    const col = db.collection(collection);
    const filter = { _id: ObjectID(id) };

    const { result } = await col.deleteOne(filter);

    if (result.ok !== 1) {
      throw new Error('Something went wrong while deleting. Please try again.');
    }

    return { success: true };
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};
