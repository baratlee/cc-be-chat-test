var levelup = require('levelup');

const database_path = "./data";

// Singleton
class DataBaseInterface {
    constructor() {
        if (typeof DataBaseInterface.instance === 'object') {
            return DataBaseInterface.instance;
        }
        // 缓存
        DataBaseInterface.instance = this;

        this.database = levelup('./data');

        return this;
    }

    kv_get(key) {
        this.database.get(key);
    }

    kv_put(key, value) {
        this.database.put(key);
    }

    kv_delete(key) {
        this.database.delete(key);
    }
}

module.exports = DataBaseInterface;