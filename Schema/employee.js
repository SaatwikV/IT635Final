require('dotenv').config();

const { MongoClient } = require('mongodb');
const Joi = require('joi');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const collectionName = 'employees';

const employeeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  hourlyPayRate: Joi.number().integer().min(0).required(),
  locationId: Joi.string().required(),
});

async function addEmployee(employee) {
  try {
    const validation = employeeSchema.validate(employee);
    if (validation.error) {
      throw new Error(validation.error);
    }
    await client.connect();
    const database = client.db();
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(employee);
    console.log(`Employee added with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function updateEmployee(employeeId, updates) {
  try {
    const validation = employeeSchema.validate(updates);
    if (validation.error) {
      throw new Error(validation.error);
    }
    await client.connect();
    const database = client.db();
    const collection = database.collection(collectionName);
    const result = await collection.updateOne(
      { _id: employeeId },
      { $set: updates }
    );
    console.log(`${result.modifiedCount} employee(s) updated`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function getEmployeesByLocation(locationId) {
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

module.exports = { addEmployee, updateEmployee, getEmployeesByLocation };
