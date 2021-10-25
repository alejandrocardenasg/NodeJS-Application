const {Storage} = require('@google-cloud/storage');
const path = require('path');
const bucketName = 'tesismlac.appspot.com';

const key = path.resolve(__dirname, './tesismlac-4b9075ea4ca4.json');

const storage = new Storage(
    {
        keyFilename: key,
        projectId: 'tesismlac'
    }
);

const bucket = storage.bucket(bucketName);

module.exports = bucket;