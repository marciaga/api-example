import mongodb from 'mongodb';
import bcrypt from 'bcrypt';

const initialUser = {
  username: 'catmeowington',
  password: '',
  name: 'Cat',
  lastname: 'Meowington',
  age: '92',
  role: 'admin',
};

const saltRounds = 10;
const plainTextPw = 'meowmeow';

async function addUser() {
  try {
    const dbName = 'disxt';
    const connection = 'mongodb://mongodb:27017';
    const dbOpts = {
      useUnifiedTopology: true,
    };

    const { MongoClient } = mongodb;
    const client = await MongoClient.connect(connection, dbOpts);
    const db = client.db(dbName);
    const col = db.collection('users');

    const pw = await bcrypt.hash(plainTextPw, saltRounds);

    initialUser.password = pw;

    await col.insertOne(initialUser);

    process.exit(0);
  } catch (error) {
    console.log(error);
  }
}

addUser();
