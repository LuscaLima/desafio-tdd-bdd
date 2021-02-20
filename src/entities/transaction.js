class Transaction {
  constructor({ customer, car, amout, dueDate }) {
    this.customer = customer
    this.car = car
    this.amout = amout
    this.dueDate = dueDate
  }
}

module.exports = Transaction
