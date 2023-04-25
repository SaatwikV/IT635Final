require('dotenv').config();

const { MongoClient } = require('mongodb');
const Joi = require('joi');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const collectionName = 'inventory';

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  quantity: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
  locationId: Joi.string().required(),
});

async function addItem(item) {
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection(collectionName);
    const validatedItem = await schema.validateAsync(item);
    const result = await collection.insertOne(validatedItem);
    console.log(`Item added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function getItemsByLocation(locationId) {
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection(collectionName);
    const result = await collection.find({ locationId }).toArray();
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

module.exports = { addItem, getItemsByLocation };
