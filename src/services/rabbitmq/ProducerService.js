const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connetion =  await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connetion.createChannel();

    // Buat Queue
    await channel.assertQueue(queue, {
      durable: true,
    });

    // kirim pesan
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    setTimeout(() => {
      connetion.close();
    }, 1000);
  }
};

module.exports = ProducerService;