/* eslint no-console: off */

const MongoClient = require('mongodb').MongoClient;

const connection = MongoClient
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(client => {
        console.log('mongodb connected');
        return client.db();
    });

module.exports = collection => {
    return connection.then(db => {
        return db.collection(collection);
    });
};
