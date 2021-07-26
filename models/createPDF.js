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

  createBarcode = async (barcodeMessage) => {
    const doc = new PDFKIT({ size:"A9" });


    const fileName = `${data.format(new Date(), 'YYYYMMDDHHmmss')}.pdf`;

    doc.font('font/weiruanyahei.ttf');

    doc.pipe(fs.createWriteStream(path.join(config.LOCATION_OF_THE_FILE, String(fileName))));



// doc.font('font/weiruanyahei.ttf').fontSize(24).text(`条码信息`,100, 80);
	
doc.fontSize(12);
// doc.font('font/weiruanyahei.ttf').text(`${barcodeMessage}`, {
//   width: 410,
//   margin: 'left',
//   align: 'justify'
// });

    // doc.moveDown();

  doc.addSVG(this.bulidBarcode(barcodeMessage), 10, 30);
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
        width:1
    });

    const svgText = xmlSerializer.serializeToString(svgNode);

    return svgText;
  }

  
}

module.exports = new PDF();