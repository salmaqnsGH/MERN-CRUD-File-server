const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fileSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    fileName: {
        type: String
    },
    content: {
        type: String,
    },
});

module.exports = mongoose.model('File', fileSchema)