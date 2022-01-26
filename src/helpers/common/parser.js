class Parser {
    #validateArg(arg) {
        if (!arg || arg.length <= 0) {
            throw new Error(`"arg" - is required instead got "${arg}"`);
        }
    }

    parse(...args) {
        this.#validateArg(args);
    }
}

module.exports = Parser;
