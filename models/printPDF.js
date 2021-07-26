const BaseController = require('../controller/BaseController');
const { logger } = require('../log');
const printer = require('printer');
const ptp = require("pdf-to-printer");
const process = require('process');
const config = require('../config');
const path = require('path');
const fs = require('fs');


class Barcode extends BaseController{
    // print = async (res, printerName, barcodeMessage) => {
    //     const filePath = path.join(config.LOCATION_OF_THE_FILE, String(barcodeMessage));
    //     logger.info({msg:`platform:'${process.platform}`});
    //     if(!printerName || !barcodeMessage){
    //         return this.errorReturn(res, 'LACA_PARAMS' );
    //     }
    //     if( process.platform != 'win32') {
    //         await printer.printFile({
    //           filename:barcodeMessage,
    //           printer: printerName || process.env[3], // printer name, if missing then will print to default printer
    //           success:function(jobID){
    //             logger.info({msg:`sent to printer with ID${jobID}`});

    //           },
    //           error:function(err){
    //             logger.error({msg: '打印失败', success: false});
    //           }
    //         });
    //       } else {
    //         // not yet implemented, use printDirect and text
    //         await printer.printDirect({data:fs.readFileSync(filePath),
    //           printer: printerName || process.env[3], // printer name, if missing then will print to default printer
    //           success:function(jobID){
    //             logger.info({msg:`sent to printer with ID${jobID}`});
    //           },
    //           error:function(err){
    //             logger.error({msg: '打印失败', success: false});
    //           }
    //         });
    //       }
          
    // }
    print = async (res, printerName, barcodeMessage) => {
      const filePath = path.join(config.LOCATION_OF_THE_FILE, String(barcodeMessage));

      const options = {
        printer: printerName,
        win32: ['-print-settings "noscale"']
      };
    
       ptp.print(filePath, options).then(console.log('success')).catch(console.error);
   
    }

 
}


const barcode = new Barcode();

module.exports = barcode;