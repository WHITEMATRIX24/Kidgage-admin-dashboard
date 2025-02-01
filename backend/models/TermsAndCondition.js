const mongoose = require("mongoose");
const termsAndConditionSchema = new mongoose.Schema({
   
    terms: { type: String,},
    policy: { type: String,},
    date:{type:Date},

});
const TermsAndCondition = mongoose.model('TermsAndCondition ', termsAndConditionSchema);
module.exports = TermsAndCondition ;
