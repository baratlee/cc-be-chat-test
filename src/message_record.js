class MessageRecord {
    constructor(user_name,message) {
        let now_date = new Date();
        this.user_name = user_name;
        this.message = message;
        this.timestamp = now_date.getTime();
    }
}
module.exports = MessageRecord;