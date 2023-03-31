import pino from 'pino';

const transport = pino.transport({
    target: '@serdnam/pino-cloudwatch-transport',
    options: {
        logGroupName: 'pino-cloudwatch-test',
        logStreamName: 'pino-cloudwatch-test-stream',
        awsRegion: process.env.AWS_REGION,
        awsAccessKeyId: process.env.AWS_ACCESS_KEY,
        awsSecretAccessKey: process.env.AWS_SECRET_KEY,
        interval: 1_000, // this is the default
    }
});

const logger = pino(transport);

export default logger;