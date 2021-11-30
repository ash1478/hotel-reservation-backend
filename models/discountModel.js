const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let discountSchema = Schema({
    "title": {
        "type": "String"
    },
    "category": {
        "type": "String"
    },
    "isPercent": {
        "type": "bool"
    },
    "value": {
        "type": "Number"
    }
},{timestamps: true});

let Discount = mongoose.model('discount',discountSchema);

module.exports = Discount;