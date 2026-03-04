<template>
  <div style="text-align:center; padding:20px">
    <h1>Laundry Service</h1>

    <!-- 🔹 FORM -->
    <input v-model="customerName" placeholder="Customer Name" />
    <input v-model.number="weight" type="number" placeholder="Weight (kg)" />
    <button @click="addOrder">Add Order</button>

    <h2>Orders</h2>

    <!-- 🔹 LIST -->
    <ul>
      <li v-for="order in orders" :key="order.id">
        {{ order.customerName }} - {{ order.weight }}kg - {{ order.price }}฿ ({{ order.status }})

        <!-- 🔥 Admin actions -->
        <button @click="updateStatus(order.id, 'washing')">Washing</button>
        <button @click="updateStatus(order.id, 'done')">Done</button>
        <button @click="deleteOrder(order.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customerName: '',
      weight: 0,
      orders: []
    }
  },
  methods: {
    async fetchOrders() {
      const res = await fetch('http://localhost:3000/orders');
      this.orders = await res.json();
    },
    async addOrder() {
      await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: this.customerName,
          weight: this.weight
        })
      });

      this.customerName = '';
      this.weight = 0;

      this.fetchOrders();
    },
    async updateStatus(id, status) {
      await fetch(`http://localhost:3000/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      this.fetchOrders();
    },
    async deleteOrder(id) {
      await fetch(`http://localhost:3000/orders/${id}`, {
        method: 'DELETE'
      });

      this.fetchOrders();
    }
  },
  mounted() {
    this.fetchOrders();
  }
}
</script>