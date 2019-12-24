var levelup = require('levelup')
var leveldown = require('leveldown')

const database_path = "./data";

// Singleton
class DataBaseInterface {
    constructor() {
        if (typeof DataBaseInterface.instance === 'object') {
            return DataBaseInterface.instance;
        }
        // 缓存
        DataBaseInterface.instance = this;

        this.database = levelup(leveldown('./data'));

        return this;
    }

    kv_get(key, callback) {
        this.database.get(key, function (error, value) {
            callback(error, value);
        });
    }

    kv_put(key, value, callback) {
        this.database.put(key, value, function (error) {
            callback(error);
        })
    }

    kv_delete(key, callback) {
        this.database.del(key, function (error) {
            callback(error);
        })
    }
}

module.exports = DataBaseInterface;