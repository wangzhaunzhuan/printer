const hcError = require('../util/hcError');
const { logger } = require('../log');

class BaseController {
    errorReturn = (res, errorCode, data = {}) => {
        res.json({success: false, msg:errorCode, data});
        logger.error({success: false, msg:errorCode, data});
    }

    succeseeReturn = (res, msg, data) => {
        res.json({ success: true, msg, data });
        logger.info({ success: true, msg, data });
    }
}

module.exports = BaseController;