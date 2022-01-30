const amqp = require('amqplib');

const ConfigService = require('../config/config.service');

module.exports = class MessageQueueService {
    static async publish(payload, key) {
        const connection = await amqp.connect(
            ConfigService.getValue('RABBIT_URL')
        );

        const channel = await connection.createChannel();

        await channel.assertExchange('base', 'direct', { durable: true });

        await channel.publish('base', key, Buffer.from(payload), {
            contentType: 'application/json',
            persistent: true,
        });
    }

    static async subscribe(queue, transporter) {
        const connection = await amqp.connect(
            ConfigService.getValue('RABBIT_URL')
        );

        const channel = await connection.createChannel();

        await channel.assertExchange('base', 'direct', { durable: true });

        await channel.assertQueue(queue, { durable: true });

        await channel.bindQueue(queue, 'base', 'direct');

        await channel.consume(
            queue,
            async (payload) => {
                const data = JSON.parse(payload.content.toString('utf-8'));

                try {
                    await transporter.sendMail(data);

                    channel.ack(payload);
                } catch (error) {
                    channel.nack(payload);

                    throw error;
                }
            },
            { noAck: false }
        );
    }
};
