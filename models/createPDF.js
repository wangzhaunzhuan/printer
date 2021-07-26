const fs  = require('fs');
const PDFKIT = require('pdfkit');
const JsBarcode = require('jsbarcode');
const SVGtoPDF = require('svg-to-pdfkit');
const BaseController = require('../controller/BaseController');
const config = require('../config');
const path = require("path");


class PDF extends BaseController {
  constructor(props) {
    super(props);
    PDFKIT.prototype.addSVG = function(svg, x, y, options) {
      return SVGtoPDF(this, svg, x, y, options), this;
    };
  }

  createBarcode = async (res, printerName, barcodeMessage) => {
    const doc = new PDFKIT({ margin: 10, size:"A7" });


    const fileName = `${barcodeMessage}.pdf`;

    doc.font('font/weiruanyahei.ttf');

    doc.pipe(fs.createWriteStream(path.join(config.LOCATION_OF_THE_FILE, String(fileName))));

    // doc.addPage({ margin: 10, size: [960,540] });


// doc.font('font/weiruanyahei.ttf').fontSize(24).text(`条码信息`,100, 80);
	
doc.fontSize(12);
// doc.font('font/weiruanyahei.ttf').text(`${barcodeMessage}`, {
//   width: 410,
//   margin: 'left',
//   align: 'justify'
// });

    // doc.moveDown();

  doc.addSVG(this.bulidBarcode(barcodeMessage), 20, 10);
  doc.moveDown();
  doc.moveDown();


    doc.endMarkedContent();

    doc.end();

    return { success: true, data: fileName };
  }

  bulidBarcode = text => {
    const { DOMImplementation, XMLSerializer } = require('xmldom');
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgNode, text, {
        xmlDocument: document,
        height:50,
    });

    const svgText = xmlSerializer.serializeToString(svgNode);

    return svgText;
  }

  
}

module.exports = new PDF();