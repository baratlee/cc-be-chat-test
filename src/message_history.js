const MessageRecord = require('./message_record');

class MessageHistory {
    constructor() {
        this.history = [];
        this.next_uid = 0;
    }

    /**
     * @param {string} user_name
     * @param {string} message
     * @return void
     */
    add_message(user_name, message) {
        this.history[this.next_uid] = new MessageRecord(user_name, message);
        this.next_uid = this.next_uid + 1;
    }

    /**
     * 取得最近五十条记录
     * @param {string} max
     * @param receiver
     * @return void
     */
    send_last_messages(max, receiver) {
        receiver.send("\n");
        for (let i = Math.max(this.next_uid - 1 - max, 0); i < this.next_uid; i++) {
            let msg_rec = this.history[i];
            receiver.send(msg_rec.user_name + ":" + msg_rec.message);
        }
    }

    /**
     * 统计五秒内最频繁的word
     * @param {number} time_limit
     * @return {string}
     */
    get_max_popular_word(time_limit) {
        let now_date = new Date();
        let timestamp = now_date.getTime() - (time_limit * 1000);
        let rec_filter_res = this.history.filter(function (item) {
            return item.timestamp >= timestamp;
        });
        let temp_array = [];
        let max_popular_word = "";
        let max_time = 0;
        rec_filter_res.forEach(function each(rec) {
            let words = rec.message.replace(/[^a-zA-Z0-9 ]/g, '');
            let array_words = words.split(" ");
            array_words.forEach(function each(word) {
                if (undefined === temp_array[word]) {
                    temp_array[word] = 1;
                } else {
                    temp_array[word] += 1;
                }
                if (temp_array[word] > max_time) {
                    max_time = temp_array[word];
                    max_popular_word = word;
                }
            });
        });
        return max_popular_word;
    }
}

module.exports = MessageHistory;