let orders = []

class Order {
  constructor(id, customerName, weight, price, status) {
    this.id = id
    this.customerName = customerName
    this.weight = weight
    this.price = price
    this.status = status
  }
}

module.exports = { orders, Order }