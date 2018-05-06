// Initialise express application
const app = require("express")();
const { ImageModel } = require("../../db/src/index");

app.get("/*", (req, res) => {
    // 1. Extract image name from URL (system immune to directory traversal attacks)
    let imageName = req.url.substring(1);// Strips the leading slash
    console.log(imageName);
    console.log(req.url);
    
    // 2. Map to file in database (if possible) with pattern id.datahash.extension
    // 2.1. Split value into array
    let imageIds = imageName.split(".");
    // 2.2. Ensure array length is 3
    if (imageIds.length != 3) {
        res.status(400).send();
        return;
    }
    // 2.3. Ensure first value is a unsigned whole number
    if (isNaN(imageIds[0])) {
        res.status(400).send();
        return;
    }

    // 3 Query database, returning file with 200 or nothing with 404 depending on result.
    ImageModel.query()
        .where({
            num: imageIds[0],
            data_hash: imageIds[1],
            extension: imageIds[2]
        })
        .select(["size_bytes", "data"])//data should be "binary" stored as a string, probably. worst case we do base64
        .then(images => {
            // Make sure there is actually an image
            if (images.length === 0) {
                res.status(404).send();
            }
            // ...and not more than 1 (in the even this every happens: HOW!? WHAT!?)
            if (images.length !== 1) {
                res.status(500).send();
                return;
            }

            let image = images[0];

            // If image has no data (a.k.a. deleted) then return 410 GONE status
            if (image.data == null) {
                res.status(410).send();
            }

            // Send file
            res.status(200)
                .attachment(imageName)
                .append("Content-Trasfer-Encoding", "binary")
                .append("Content-Length", 1)
                .send(image.data);
        })
        .catch(reason => {
            // Something bad has happened.
            res.status(500).send();
        });
    
})

app.listen(8888);
