const winston = require('winston');
const expressWinston = require('express-winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const { format } = require('winston');



var alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all:true
    }),
    winston.format.label({
        label:'[ZICOXHTD]'
    }),
    winston.format.timestamp({
        format:"YYYY-MM-DD HH:mm:ss.SSS"
    }),
    winston.format.printf(
        info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
    )
);

var transport = new winston.transports.DailyRotateFile({
    filename: './logs/rfid-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '7d',
    });
  
    
var logger = winston.createLogger({
    level: "debug",
    transports: [
        new (winston.transports.Console)({
            format: alignColorsAndTime
        })
    ]
    });

expressWinston.requestWhitelist.push('body');  
expressWinston.responseWhitelist.push('body');

var loggerConfig = expressWinston.logger({
    transports: [
        transport,
        new (winston.transports.Console)({
        meta: true,
        json: true,
        colorize: true,
        format: alignColorsAndTime
        })
    ],
    format: format.combine(
        format.timestamp({format:'YYYY-MM-DD HH:mm:ss.SSS'}),
        format.json()
    )
})



module.exports = { logger, loggerConfig };