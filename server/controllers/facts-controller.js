'use strict';

module.exports = function ({data}) {
    return {
        uploadFact(req, res, img) {
            console.log('uploaded! must be saved to the user and facts data!');
            let uploader = req.body.username;
            let title = req.body.title;
            let category = req.body.category;
            
            data.createFact({ title, uploader, img, category });

            res.json({ isUploaded: true });
        }
    };
};







