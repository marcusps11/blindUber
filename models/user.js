var mongoose = require('mongoose');

module.exports = 
mongoose.model('User',
  { uber: 
    { uuid: String,
    picture: String, 
    first_name: String, 
    last_name: String,
    promo_code: String,
    email: String,
    provider: String} }); 



