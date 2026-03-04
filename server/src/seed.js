const { sequelize, User, Service } = require('./models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@laundry.com',
      password: hashedPassword,
      phone: '555-0100',
      role: 'admin',
      status: 'active'
    });
    console.log('Admin user created:', adminUser.email);

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('user123', 10),
      phone: '555-0101',
      role: 'user',
      status: 'active'
    });
    console.log('Regular user created:', regularUser.email);

    // Create sample services
    const services = [
      {
        name: 'Regular Wash',
        price: 5.99,
        description: 'Standard washing service for daily wear clothes'
      },
      {
        name: 'Dry Cleaning',
        price: 12.99,
        description: 'Professional dry cleaning for delicate and formal wear'
      },
      {
        name: 'Ironing Service',
        price: 3.99,
        description: 'Perfect ironing for all types of clothing'
      },
      {
        name: 'Express Wash',
        price: 8.99,
        description: 'Fast washing service completed within 2 hours'
      },
      {
        name: 'Bleach Treatment',
        price: 4.99,
        description: 'Special bleaching treatment for white clothes'
      },
      {
        name: 'Stain Removal',
        price: 6.99,
        description: 'Professional stain removal service'
      }
    ];

    for (const serviceData of services) {
      const service = await Service.create(serviceData);
      console.log('Service created:', service.name);
    }

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@laundry.com / admin123');
    console.log('User: john@example.com / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
