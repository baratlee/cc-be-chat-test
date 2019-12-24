const MessageRecord = require('./message_record');
const DatabaseInterface = require('./util/database_interface');
let db_if = new DatabaseInterface();

class MessageHistory {
    constructor() {
        this.history = [];
        this.next_uid = 0;
        let inner_this = this;
        db_if.kv_get('next_uid', function (error, value) {
            if(error){
                console.log("MessageHistory constructor. value:" + value + "  next_uid:"+inner_this.next_uid+ "  error"+error);
            } else {
                let next_uid_value =  Number(value);
                if(typeof next_uid_value === 'number' && !isNaN(next_uid_value)) {
                    inner_this.next_uid = Number(value);
                    for (let i = inner_this.next_uid;i >= 0;i--) {
                        db_if.kv_get('uid'+i, function (rec_error, rec_value) {
                            if(error || rec_value == undefined || rec_value == 'undefined'){
                                console.log("get rec history error:"+rec_error);
                            } else {
                                if(typeof(rec_value) === 'object') {
                                    let msg_rec = new MessageRecord('', '');
                                    msg_rec.init_from_json(rec_value);
                                    inner_this.history[i] = msg_rec;
                                }else{
                                    console.log("get rec history error2:" + typeof(rec_value));
                                }

                            }
                        });
                    }
                }
                inner_this.next_uid += 1;
                // console.log("MessageHistory constructor. value:" + next_uid_value + "  next_uid:"+inner_this.next_uid);
            }
        });
    }

    /**
     * @param {string} user_name
     * @param {string} message
     * @return void
     */
    add_message(user_name, message) {
        let msg_rec = new MessageRecord(user_name, message);
        this.history[this.next_uid] = msg_rec;
        this.next_uid = this.next_uid + 1;
        let inner_this = this;
        db_if.kv_put('next_uid',this.next_uid.toString(), function (error) {
            // TODO check error
        });
        db_if.kv_put('uid'+this.next_uid,msg_rec.get_str(), function (error) {
            // TODO check error
        });
        db_if.kv_get('next_uid', function (error, value) {
            // TODO check error
            inner_this.next_uid = +value;
        });
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
            if (msg_rec != null && msg_rec != undefined && 'object' == typeof msg_rec){
                receiver.send(msg_rec.user_name + ":" + msg_rec.message);
            }
            else{
                // TODO check error
                // console.log("msg_rec error:"+msg_rec+" "+typeof(msg_rec));
            }
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