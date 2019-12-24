class MessageRecord {
    constructor(user_name, message) {
        let now_date = new Date();
        this.user_name = user_name;
        this.message = message;
        this.timestamp = now_date.getTime();
    }

    /**
     * @return {string}
     */
    get_str() {
        let json = {'user_name': this.user_name, 'message': this.message, 'timestamp': this.timestamp};
        let str = JSON.stringify(json);
        return str;
    }

    /**
     * THINK 我还不知道javascript是否可以重载构造函数
     * @param {string} json_str
     * @return void
     */
    init_from_json(json_str) {
        let json = JSON.parse(json_str);
        this.user_name = json['user_name'];
        this.message = json['message'];
        this.timestamp = json['timestamp'];
    }
}

module.exports = MessageRecord;