const fs = require('fs');
const { addLocation } = require('./Schema/location');
const { addItem } = require('./Schema/inventory');
const { addEmployee } = require('./Schema/employee');

// Read data from file
const rawData = fs.readFileSync('data.json');
const data = JSON.parse(rawData);

async function addSampleData() {
  try {
    // Add locations
    const locations = data.locations;
    for (const location of locations) {
      await addLocation(location);
    }
    console.log(`Added ${locations.length} locations`);

    // Add inventory items
    const items = data.inventory;
    for (const item of items) {
      await addItem(item);
    }
    console.log(`Added ${items.length} items`);

    // Add employees
    const employees = data.employees;
    for (const employee of employees) {
      await addEmployee(employee);
    }
    console.log(`Added ${employees.length} employees`);
  } catch (err) {
    console.error(err);
  }
}

addSampleData();
