const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const barcodecontroller = require('./controller/Barcodecontroller');
const { logger, loggerConfig } = require('./log');

const app = express();

app.use(loggerConfig);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
    
app.post('/print', barcodecontroller.print);
app.post('/createBarcodeAndPrint', barcodecontroller.createBarcodeAndPrint);
app.use((req, res) => {
    res.json({msg:'ROUTE_NOT_FOUND', code: 404, date: []});
    logger.error({msg:'ROUTE_NOT_FOUND', code: 404, date:[]});

})

app.listen(config.LISTEN_PORT, config.LISTEN_IP, () => logger.info({ msg:`ip:${config.LISTEN_IP} port:${config.LISTEN_PORT}`, success: true}) );


