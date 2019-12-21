import test from 'ava';

const CharTrie = require("../src/util/char_trie");
const MessageHistory = require("../src/message_history");

const message_history = new MessageHistory();

function trimAll(string) {
    return string.replace(/[\s\b]/g, '');
}

test('chat server testing', t => {
    // 字符串内含有空格符、制表符等空字符都应删除
    t.is(trimAll(' \n \r \t \v \b \f B a r r  i  o  r  \n  \r  \t  \v  \b  \f  '), 'Barrior');

    // 无空字符时，输出值应为输入值
    t.is(trimAll('Barrior'), 'Barrior');

    // 输入 new String 对象应与输入基本类型字符串结果相同
    t.is(trimAll(new String(' T o m ')), 'Tom');

    let ct = new CharTrie();
    ct.addChar("aa");
    ct.addChar("ab");
    ct.addChar("hell");

    t.is(ct.getMaxCharPos("aabb"), 1);
    t.is(ct.getMaxCharPos("tree"), -1);
    t.is("Ab".toLowerCase(), "ab");
    t.is(ct.getMaxCharPos("ab"), 1);
    t.is(ct.getMaxCharPos("Ab"), 1);
    t.is(ct.getMaxCharPos("hellboy"), 3);

    message_history.add_message("jack", "hi hi");
    message_history.add_message("time", "jump, jump jump");

    t.is(message_history.get_max_popular_word(5), "jump");

    // 输入其他非字符串数据类型时，应抛出错误
    [undefined, null, 0, true, [], {}, () => {
    }, Symbol()].forEach(type => {
        t.throws(() => {
            trimAll(type);
        });
    });
});