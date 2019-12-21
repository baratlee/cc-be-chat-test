const CharTrieNode = require("./char_trie_node");

// Character that we will use for trie tree root.
const ROOT_CHARACTER = '';

class CharTrie {
    constructor() {
        this.head = new CharTrieNode(ROOT_CHARACTER);
    }

    /**
     * @param {string} char
     * @return {CharTrie}
     */
    addChar(char) {
        const characters = Array.from(char);
        let currentNode = this.head;

        for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
            const isComplete = charIndex === characters.length - 1;
            currentNode = currentNode.addChild(characters[charIndex], isComplete);
        }

        return this;
    }

    /**
     * @param {string} char
     * @return {CharTrie}
     */
    deleteChar(char) {
        // not necessary
        return this;
    }

    /**
     * Check if complete word exists in CharTrie.
     *
     * @param {string} word
     * @return {boolean}
     */
    doesWordExist(word) {
        const lastCharacter = this.getLastCharNode(word);

        return !!lastCharacter && lastCharacter.isCompleteWord;
    }

    /**
     * @param {string} word
     * @return {CharTrieNode}
     */
    getLastCharNode(word) {
        const characters = Array.from(word);
        let currentNode = this.head;

        for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
            if (!currentNode.hasChild(characters[charIndex])) {
                return null;
            }

            currentNode = currentNode.getChild(characters[charIndex]);
        }

        return currentNode;
    }

    /**
     * Returns the qualified string tail pos
     * @param {string} total_word
     * @return {Number}
     */
    getMaxCharPos(total_word) {
        const characters = Array.from(total_word.toLowerCase());
        let currentNode = this.head;
        let end_pos = -1;

        for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
            if (!currentNode.hasChild(characters[charIndex])) {
                break;
            }
            currentNode = currentNode.getChild(characters[charIndex]);
            if (currentNode.isCompleteWord) {
                end_pos = charIndex;
            }
        }

        return end_pos;
    }
}

module.exports = CharTrie;
