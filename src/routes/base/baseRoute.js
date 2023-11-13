const { base } = require("../../../db/strategies/mongodb/schemas/heroisSchema")

class BaseRoute {
    static methods() {
        return Object.getOwnPropertyNames(this.prototype)
                    .filter(method => method !== 'constructor' && !method.startsWith('_'))
    }
}

module.exports = BaseRoute