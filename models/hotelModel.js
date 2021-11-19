const mongoose = require('mongoose');
const roomSchema = require('./roomModel');
let Schema = mongoose.Schema;

var hotelSchema = Schema({
    "name": {
        "type": "String"
    },
    "desc": {
        "type": "String"
    },
    "imageUrls": {
        "type": [
            "String"
        ]
    },
    "rating": {
        "type": "Number"
    },
    "location": {
        "type": "String"
    },
    "mapUrl": {
        "type": "String"
    },
    "roomTypes": {
        "type": [
            "String"
        ]
    },
    "roomPrice":{
        "type": "Mixed"
    },
    "roomCount": {
        "type": "Mixed"
    },
    "tags": {
        "type": [
            "String"
        ]
    },
    "rules": {
        "type": [
            "String"
        ]
    },
    "rooms":[roomSchema]
}, { timestamps: true });
let Hotel = mongoose.model('hotel', hotelSchema);
module.exports = Hotel; 
