const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'nama harus diisi'],
        maxlength :[225, "panjang nama harus antara 3 - 225 karakter"],
        minlength :[3, "panjang nama harus antara 3 - 225 karakter"]
    },
    email: {
        type: String,
        require: [true, 'email harus diisi']
    },
    country: {
        type: String,
    },
});

module.exports = mongoose.model('User', userSchema)