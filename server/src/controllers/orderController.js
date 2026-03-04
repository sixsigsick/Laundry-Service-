const { Order, OrderDetail, Service, User } = require('../models');

// Create order
const createOrder = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ serviceId, quantity }]
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Calculate total price
    let totalPrice = 0;
    const orderDetails = [];

    for (const item of items) {
      const service = await Service.findByPk(item.serviceId);
      if (!service) {
        return res.status(400).json({ message: `Service with ID ${item.serviceId} not found` });
      }
      
      const itemTotal = parseFloat(service.price) * item.quantity;
      totalPrice += itemTotal;
      
      orderDetails.push({
        serviceId: item.serviceId,
        quantity: item.quantity
      });
    }

    // Create order
    const order = await Order.create({
      userId: req.user.userId,
      totalPrice: totalPrice.toFixed(2),
      status: 'Pending'
    });

    // Create order details
    for (const detail of orderDetails) {
      await OrderDetail.create({
        orderId: order.id,
        serviceId: detail.serviceId,
        quantity: detail.quantity
      });
    }

    // Return order with details
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderDetail,
          include: [Service]
        }
      ]
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: OrderDetail,
          include: [Service]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderDetail,
          include: [Service]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Ready', 'Completed', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order (User only, only if status is Pending)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only cancel orders with Pending status' });
    }

    await order.update({ status: 'Cancelled' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue report (Admin only)
const getRevenueReport = async (req, res) => {
  try {
    const completedOrders = await Order.findAll({
      where: { status: 'Completed' },
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('totalPrice')), 'totalRevenue'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'totalOrders']
      ]
    });

    const revenue = completedOrders[0].totalRevenue || 0;
    const orderCount = completedOrders[0].totalOrders || 0;

    res.json({
      totalRevenue: parseFloat(revenue).toFixed(2),
      totalOrders: parseInt(orderCount)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getRevenueReport
};
