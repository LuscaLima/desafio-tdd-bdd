const Base = require("./base/base")

class Customer extends Base {
  constructor({ id, name, birthDate }) {
    super({ id, name })

    this.birthDate = birthDate
  }
}

module.exports = Customer
