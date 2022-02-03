const amqp = require('amqplib');

const ConfigService = require('../config/config.service');

module.exports = class MessageQueueService {
    static async publish(payload, type) {
        const message = JSON.stringify(payload);

        const url = ConfigService.getValue('RABBIT_URL');

        const connection = await amqp.connect(url);

        const channel = await connection.createChannel();

        const exchange = await channel.assertExchange('exOne', 'direct', {
            durable: true,
        });

        await channel.publish(exchange.exchange, type, Buffer.from(message), {
            persistent: true,
        });
    }

    static async subscribe(transporter, type) {
        const url = ConfigService.getValue('RABBIT_URL');

        const connection = await amqp.connect(url);

        const channel = await connection.createChannel();

        const queue = await channel.assertQueue('task_q', { durable: true });

        await channel.bindQueue(queue.queue, 'exOne', type);

        await channel.consume(queue.queue, async (msg) => {
            const data = JSON.parse(msg.content.toString('utf8'));

            try {
                await transporter.sendMail(data);

                channel.ack(msg);
            } catch (error) {
                channel.nack(msg);

                throw error;
            }
        });
    }
};
