import mongodb from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { ObjectID } = mongodb;
const collection = 'users';

export const getAll = async ({ db }) => {
  try {
    const col = db.collection(collection);
    const opts = {
      projection: { password: 0 },
    };
    const users = await col.find({}, opts).toArray();

    return users;
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};

export const getById = async ({ db, id }) => {
  try {
    const col = db.collection(collection);
    const opts = {
      projection: { password: 0 },
    };
    const user = await col.findOne({ _id: ObjectID(id) }, opts);

    return user;
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};

export const authenticate = async ({ db, username, password: pw }) => {
  try {
    const col = db.collection(collection);
    const doc = { username };
    const user = await col.findOne(doc);

    const match = await bcrypt.compare(pw, user.password);

    if (!match) {
      return {};
    }

    const { password, ...rest } = user;
    const token = jwt.sign({
      sub: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET);

    return {
      ...rest,
      token,
    };
  } catch (error) {
    console.log('error: ', error);
    throw error; // this is caught by the caller and handled in middleware
  }
};
