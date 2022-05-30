const fs = require('fs/promises');

exports.readEndpoints = () => {
    return fs.readFile('./endpoints.json').then((data) => {
        return JSON.parse(data);
    })
}