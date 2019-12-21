class CharTrieNode {
    /**
     * @param {string} character
     * @param {boolean} isCompleteWord
     */
    constructor(character, isCompleteWord = false) {
        this.character = character;
        this.isCompleteWord = isCompleteWord;
        this.children = [];
    }

    /**
     * @param {string} character
     * @return {CharTrieNode}
     */
    getChild(character) {
        return this.children[character];
    }

    /**
     * @param {string} character
     * @param {boolean} isCompleteWord
     * @return {CharTrieNode}
     */
    addChild(character, isCompleteWord = false) {
        if (undefined === this.children[character]) {
            this.children[character] = new CharTrieNode(character, isCompleteWord);
        }

        const childNode = this.children[character];

        // 保留之前的isCompleteWord属性
        childNode.isCompleteWord = childNode.isCompleteWord || isCompleteWord;

        return childNode;
    }

    /**
     * @param {string} character
     * @return {boolean}
     */
    hasChild(character) {
        return undefined !== this.children[character];
    }

    /**
     * @param {string} character
     * @return {CharTrieNode}
     */
    removeChild(character) {
        // not necessary
        return this;
    }
}

module.exports = CharTrieNode;