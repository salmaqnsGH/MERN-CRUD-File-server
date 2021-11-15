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
    password: {
        type: String,
        require: [true, 'kata sandi harus diisi'],
        maxlength :[225, "panjang password maksimal 225 karakter"],
    },
});

userSchema.path('email').validate(async function(value){
    try{
      const count = await this.model('User').countDocuments({email:value})
      return !count;
    }catch(err){
      throw err
    }
  }, attr=>`${attr.value} sudah terdaftar`)

module.exports = mongoose.model('User', userSchema)