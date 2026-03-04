const { orders, Order } = require('../models/orderModel')

exports.getAllOrders = (req, res) => {
  res.json(orders)
}

exports.createOrder = (req, res) => {
  const { customerName, weight } = req.body
  const price = weight * 20

  const newOrder = new Order(
    orders.length + 1,
    customerName,
    weight,
    price,
    "pending"
  )

  orders.push(newOrder)
  res.json(newOrder)
}