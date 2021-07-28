const fs  = require('fs');
const PDFKIT = require('pdfkit');
const JsBarcode = require('jsbarcode');
const SVGtoPDF = require('svg-to-pdfkit');
const BaseController = require('../controller/BaseController');
const config = require('../config');
const path = require("path");
const data = require('silly-datetime');


class PDF extends BaseController {
  constructor(props) {
    super(props);
    PDFKIT.prototype.addSVG = function(svg, x, y, options) {
      return SVGtoPDF(this, svg, x, y, options), this;
    };
  }

  createBarcode = async (barcodeMessage, barcodeSpecifications) => {
    const doc = new PDFKIT({ autoFirstPage: false });

    doc.addPage({ margin: 10, size: [141, 85] });
    const fileName = `${data.format(new Date(), 'YYYYMMDDHHmmss')}.pdf`;

    doc.font('font/weiruanyahei.ttf');

    doc.pipe(fs.createWriteStream(path.join(config.LOCATION_OF_THE_FILE, String(fileName))));
    // doc.font('font/weiruanyahei.ttf').fontSize(24).text(`条码信息`,100, 80);

    if(String(barcodeMessage).trim().length >= 7 && String(barcodeMessage).trim().length <= 10){
      var x = 45;
    }else if(String(barcodeMessage).trim().length >= 0 && String(barcodeMessage).trim().length < 7){
      var x = 60;
    }else if(String(barcodeMessage).trim().length > 10 && String(barcodeMessage).trim().length < 17){
      var x = 30
    }else{
      var x = 20;
    }
    doc.addSVG(this.bulidBarcode(barcodeMessage, barcodeSpecifications), x, 25);
    doc.fontSize(10);
    doc.endMarkedContent();

    doc.end();

    return { success: true, data: fileName };
  }

  bulidBarcode = (text, barcodeSpecifications) => {
    const { DOMImplementation, XMLSerializer } = require('xmldom');
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    JsBarcode(svgNode, text, {
        xmlDocument: document,
        height:50,
        width:1,
        fontSize:13,
        background:"#ffffff",
        format: barcodeSpecifications ? barcodeSpecifications : "CODE128"//(CODE128)

    });

    const svgText = xmlSerializer.serializeToString(svgNode);

    return svgText;
  }

  
}

module.exports = new PDF();