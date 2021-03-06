let Bottleneck = require('bottleneck');
let Airtable = require('airtable');

let limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 250
});

// Lib Helper Methods
let errorHandler = (error) => {
  console.trace();
  console.log('Airtable Error:', error);
}

let getOnlyValuesFromData = (data) => {
	let newData = {};

	for (let key in data) {
		if (data[key] !== undefined) newData[key] = data[key];
	}

	return newData;
}

// Lib Methods
let getTable = (tableName) => (baseID) => {
	let base = Airtable.base(baseID);
	let table = base(tableName);
	return table;
}

let getDataFromTable = (table) => limiter.wrap(
  (filterQuery = {}) => {
    return table.select(filterQuery).firstPage().catch(errorHandler);
  }
);

let getAllDataFromTable = (table) => limiter.wrap(
  (filterQuery = {}) => {
    return table.select(filterQuery).all().catch(errorHandler);
  }
);

let findTableData = (table) => limiter.wrap(
  (data_ID) => {
    return table.find(data_ID).catch(errorHandler);
  }
);

let createTableData = (table) => limiter.wrap(
  (data) => {
    let newData = getOnlyValuesFromData(data);
    return table.create(newData).catch(errorHandler);
  }
);

let updateTableData = (table) => limiter.wrap(
  (updateData, dataRecord) => {
    let newData = getOnlyValuesFromData(updateData);
    return table.update(dataRecord.id, newData).catch(errorHandler);
  }
);

let destroyTableData = (table) => limiter.wrap(
  (data_ID) => {
    return table.destroy(data_ID).catch(errorHandler);
  }
);

module.exports = {
	getTable,
	getDataFromTable,
	getAllDataFromTable,
	findTableData,
	createTableData,
	updateTableData,
	destroyTableData,
}