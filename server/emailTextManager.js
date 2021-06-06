const fs = require('fs');

const create = (fileName, dbEmailEntry) => {
  const data = new Uint8Array(Buffer.from(dbEmailEntry));
  fs.writeFile(fileName, data, 'utf8', error => {
    if (error) throw error;
    console.log('success');
  });
};

const read = fileName => {
  fs.readFile(fileName, 'utf8', (error, data) => {
    if (error) throw error;
    console.log(data);
  });
};

module.exports = {
  createEmail: create,
  readEmail: read
};
