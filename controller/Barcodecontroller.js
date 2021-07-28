const BaseController = require('./BaseController');
const { logger } = require('../log');
const printPDF = require('../models/printPDF');
const createPDF = require('../models/createPDF');
const config = require('../config');
const fs = require('fs');
const printer = require('printer');
const path  = require('path');



class BarcodeController extends BaseController {
    constructor(props){
        super(props);
    }

    print = async (req, res) =>{
        const { printerName, barcodeMessage } = req.body;

        if(!printerName || !barcodeMessage){
            return this.errorReturn(res, 'LACA_PARAMS');
        }

         // 查找文件夹，如果文件夹不存在，则自动创建
        await this.findFile();

        // 判断打印机是否存在
        const getPrinterResult = await this.getPrinters(printerName);
        if (!getPrinterResult) { 
        return this.errorReturn(res, '打印机不存在', {});
        };

        // 判断打印文件是否存在
        const getFileResule = await this.findPDF(barcodeMessage);
        if(!getFileResule){
          return this.errorReturn(res, '打印文件不存在', {});
        };
    
       
        await printPDF.print(res, printerName, barcodeMessage);
        return this.succeseeReturn(res, `成功发送打印机,型号为：${printerName}`, {});
    }

    createBarcodeAndPrint = async (req, res) => {
        const { printerName, barcodeMessage, barcodeSpecifications } = req.body;

        if(!printerName || !barcodeMessage){
            return this.errorReturn(res, 'PARAMS_ERROR', {});
        }
        if(barcodeSpecifications){
        const numberValue = await this.isBarcodeSpecifications(barcodeSpecifications)
        if( numberValue < 0){
            return this.errorReturn(res, 'BARCODE_IS_NOT_SUPPORT', {});
        }
        }
        
        await this.findFile();

        const result = await createPDF.createBarcode(barcodeMessage, barcodeSpecifications);
        req.body.barcodeMessage = result.data;
        await this.print(req, res);

    }
    
    // 判断打印机是否存在
    getPrinters = async (printerName) => {
        let printers = await printer.getPrinters();
        return printers.some(ele => ele.name === printerName)
    }
    // 判断打印文件是否存在
    findPDF = async (fileName) => {
        return await fs.existsSync(path.join(config.LOCATION_OF_THE_FILE, String(fileName)));
    }

    // 判断储存的文件夹是否存在
    findFile = async () => {
            // 查找文件夹，如果文件夹不存在，则自动创建
            if (!fs.existsSync(config.LOCATION_OF_THE_FILE)) {
                fs.mkdirSync(config.LOCATION_OF_THE_FILE, { recursive: true });
            }
    }

    // 判断一维码的格式是否存在
    isBarcodeSpecifications = async (barcodeSpecifications) => {
        let arr = ["EAN13", "EAN8", "EAN5", "EAN2", "UPC", "CODE39", "ITF" , "pharmacode", "codabar", "MSI10", "MSI11", "MSI1010" ,"MSI1110"];
        return arr.indexOf(barcodeSpecifications);

    }

}

const barcodeController = new BarcodeController();


module.exports = barcodeController;