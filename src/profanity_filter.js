const file_stream = require("fs");
const CharTrie = require("./util/char_trie");

class ProfanityFilter {

    /**
     * @param {string} file_name
     * @return void
     */
    constructor(file_name) {
        let ct = new CharTrie();
        this.head = ct;
        this.init_finish = false;    // flag of init finish
        let inner_this = this;
        file_stream.readFile(file_name, "utf-8", function (error, file_data) {
            if (error) return console.log("fail:" + error.message);
            let array_words = Array.from(file_data.split("\n"));
            console.log("success " + array_words.length);
            array_words.forEach((item, index, array) => {
                ct.addChar(item);
            })
            inner_this.init_finish = true;
        });
    }

    /**
     * @param {string} total_word
     * @return {Number}
     */
    getMaxCharPos(total_word) {
        return this.head.getMaxCharPos(total_word);
    }
}

module.exports = ProfanityFilter;