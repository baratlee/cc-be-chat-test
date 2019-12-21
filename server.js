const WebSocket = require('ws');
const ProfanityFilter = require('./src/profanity_filter');
const MessageHistory = require('./src/message_history');

const profanity_filter = new ProfanityFilter("./data/list.txt");
const listen_handle = new WebSocket.Server({port: 3000});
const message_history = new MessageHistory();
let array_login_timestamp = [];

listen_handle.on('connection', function connection(client_handle) {

    // 设置接收回调函数
    client_handle.on('message', function incoming(raw_message) {
        let message = check_profanity_words(raw_message);
        if (undefined === this.id) {
            // the first message is name
            // if need Password Check, it can be here
            let now_date = new Date();
            array_login_timestamp[message] = now_date.getTime();
            this.id = message;
            message_history.send_last_messages(50, client_handle);
        } else if (0 === message.indexOf("/")) {
            do_command(message, client_handle)
        } else if ("" !== message) {
            let sender_name = this.id;
            message_history.add_message(sender_name, message);
            broadcast_msg(listen_handle.clients, client_handle, sender_name + ":" + message);
        } else {
            // message has no words
        }
    });

    client_handle.on('close', function connection(handle) {
        delete array_login_timestamp[this.id];
        console.log('close:%s', this.id);
    });

    client_handle.on('error', function connection(handle) {
        delete array_login_timestamp[this.id];
        console.log('error:%s %s', this.id);
    });

    console.log('connected:%s', client_handle.id);
});

/**
 * @param clients
 * @param client_handle
 * @param {string} message
 * @return void
 */
function broadcast_msg(clients, client_handle, message) {
    listen_handle.clients.forEach(function each(acc_client) {
        // if (client_handle !== acc_client && undefined !== acc_client.id && WebSocket.OPEN === acc_client.readyState) {
        if (undefined !== acc_client.id && WebSocket.OPEN === acc_client.readyState) {
            acc_client.send(message);
        }
    });
}

/**
 * @param {string} message
 * @return void
 */
function do_command(message, client_handle) {
    if (0 === message.indexOf("/popular")) {
        let res_str = command_popular();
        client_handle.send("\n\t" + res_str);
    } else if (0 === message.indexOf("/stats")) {
        let array_args = message.split(" ");
        let user_name = "";
        if (array_args.length > 1) {
            user_name = array_args[1];
        } else {
            user_name = client_handle.id;
        }
        let res_str = command_stats(user_name);
        client_handle.send("\n\t" + res_str);
    } else {
        // other command, do nothing
    }
}

/**
 * @return {string}
 */
function command_popular() {
    return message_history.get_max_popular_word(5);
}

/**
 * @param {string} user_name
 * @return {string}
 */
function command_stats(user_name) {
    let res_str = "";
    let login_timestamp = array_login_timestamp[user_name];
    if (undefined === login_timestamp) {
        res_str = get_time_diff_string(0);
    } else {
        res_str = get_time_diff_string(login_timestamp);
    }
    return res_str;
}

/**
 * @param {number} timestamp
 * @return {string}
 */
function get_time_diff_string(timestamp) {
    let now_date = new Date();
    let diff_ms = now_date.getTime() - timestamp;
    if (diff_ms <= 0 || timestamp <= 0) {
        return "00d 00h 00m 00s";
    } else {
        console.log('get_time_diff_string:%s', diff_ms);
        let days = Math.floor(diff_ms / (24 * 3600 * 1000));
        let leave1 = diff_ms % (24 * 3600 * 1000);
        let hours = Math.floor(leave1 / (3600 * 1000));
        let leave2 = leave1 % (3600 * 1000);
        let minutes = Math.floor(leave2 / (60 * 1000));
        let leave3 = leave2 % (60 * 1000);
        let seconds = Math.round(leave3 / 1000);
        return fix_digit_format(days) + "d " + fix_digit_format(hours) + "h " + fix_digit_format(minutes) + "m " + fix_digit_format(seconds) + "s";
    }
}

/**
 * @param {number} num
 * @return {string}
 */
function fix_digit_format(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

/**
 * @param {string} message_str
 * @return {string}
 */
function check_profanity_words(message_str) {
    let result = profanity_filter.getMaxCharPos(message_str);
    if (-1 === result) {
        if (message_str.length > 0) {
            return message_str.substr(0, 1) + check_profanity_words(message_str.substr(1));
        } else {
            return message_str;
        }
    } else {
        let head_string = "";
        for (let i = 0; i <= result; i++) {
            head_string += '*';
        }
        if (result < message_str.length - 1) {
            return head_string + check_profanity_words(message_str.substr(result + 1));
        } else {
            return head_string;
        }
    }
}
