const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];
let id = 1;

// 📌 GET all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// 📌 CREATE order
app.post('/orders', (req, res) => {
  const { customerName, weight } = req.body;

  const price = weight * 20;

  const newOrder = {
    id: id++,
    customerName,
    weight,
    price,
    status: 'pending'
  };

  orders.push(newOrder);
  res.json(newOrder);
});

// 📌 UPDATE status
app.put('/orders/:id', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id == req.params.id);

  if (!order) return res.status(404).send('Not found');

  order.status = status;
  res.json(order);
});

// 📌 DELETE order
app.delete('/orders/:id', (req, res) => {
  orders = orders.filter(o => o.id != req.params.id);
  res.send('Deleted');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});