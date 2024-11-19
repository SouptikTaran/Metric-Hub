const express = require('express');
const { doSomeHeavyTask } = require('./utils');
const client = require('prom-client');
const responseTime = require('response-time')
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
    transports: [
        new LokiTransport({
            labels: {
                appName: "express",
            },
            host: "http://127.0.0.1:3100"
        })
    ]
};
const logger = createLogger(options);

const app = express();
const PORT = 8000;


client.collectDefaultMetrics({ register: client.register });


const reqResTime = new client.Histogram({
    name: "http_express_res_req_time",
    help: "This tells how much Time is taken by Request and Response",
    labelNames: ["method", "route", "status_code"],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
})

const totalReqCounter = new client.Counter({
    name: 'total_Req',
    help: 'Tells Total Request',
    labelNames: ['method', 'route']

})

app.use(responseTime((req, res, time) => {
    totalReqCounter.inc()
    reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
    }).observe(time)
}))



app.get('/', (req, res) => {
    logger.info('Request on Home')
    res.json({ message: 'Hello from server' })
})

app.get('/slow', async (req, res) => {
    try {
        logger.info('Request on Slow')
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "Success",
            message: `Heavy Task completed in ${timeTaken}ms`
        })
    } catch (error) {
        logger.error(error.message)
        return res
            .status(500)
            .json({
                status: "Error", error: 'Internal Server Error'
            })
    }
})

// Expose metrics for Prometheus
app.get('/metrics', async (req, res) => {
    try {
        const metrics = await client.register.metrics();
        res.set('Content-Type', client.register.contentType);
        res.send(metrics);
    } catch (err) {
        res.status(500).send('Could not retrieve metrics');
    }
});

app.listen(PORT, () => {
    console.log('Server Started on 8000')
})