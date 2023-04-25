require('dotenv').config();
const { MongoClient } = require('mongodb');
const Joi = require('joi');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const collectionName = 'locations';

const schema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
});

async function addLocation(location) {
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection(collectionName);
    const validatedLocation = await schema.validateAsync(location);
    const result = await collection.insertOne(validatedLocation);
    console.log(`Location added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function getLocationById(id) {
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection(collectionName);
    const result = await collection.findOne({ _id: id });
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

module.exports = { addLocation, getLocationById };
