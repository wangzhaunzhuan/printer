const BaseController = require('../controller/BaseController');
const { logger } = require('../log');
const ptp = require("pdf-to-printer");
const config = require('../config');
const path = require('path');
const fs = require('fs');
const nodePdfPrinter = require('node-pdf-printer');

class Barcode extends BaseController{
    print = async (res, printerName, barcodeMessage) => {
      clearTimeout(clearFiles);
      const array = [
        `${config.LOCATION_OF_THE_FILE}${barcodeMessage}`,
        // path.resolve(`${config.LOCATION_OF_THE_FILE}`)
      ];
      await nodePdfPrinter.printFiles(array, printerName);
      var clearFiles = setTimeout(async () => {
            await this.deletePDF(config.LOCATION_OF_THE_FILE, 2);
             
           }, 600000);
    }

    deletePDF = async (url, time) => {
      let files = fs.readdirSync(url);
      for(let file of files){
              var filePathName = path.join(url, file);
              let states = fs.statSync(filePathName);
                  // 检查现在的时间
              let timer = + new Date();
              // PDF存在的时间
              let creaTime = + states.birthtime;
              // 检查存在的时长
              let lifespan = (timer-creaTime)/1000/60/60/24;
              if(lifespan >= time){
                    fs.unlinkSync(filePathName);
                  }

      }

    }

 
}


const barcode = new Barcode();

module.exports = barcode;