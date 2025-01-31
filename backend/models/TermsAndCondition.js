const mongoose = require("mongoose");
const termsAndConditionSchema = new mongoose.Schema({
   
    terms: { type: String,},
    policy: { type: String,},

});
const TermsAndCondition = mongoose.model('TermsAndCondition ', termsAndConditionSchema);
module.exports = TermsAndCondition ;
