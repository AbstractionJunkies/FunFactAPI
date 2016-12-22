'use strict';

module.exports = function () {
    return {
        uploadFact(req, res) {
            console.log('uploaded! must be saved to the user and facts data!');
            console.log(req.body);
            
            res.json({isUploaded:true});
        }
    };
};







