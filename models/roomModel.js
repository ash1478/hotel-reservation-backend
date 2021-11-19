const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var roomSchema = Schema({
    "name": {
        "type": "String"
    },
    "type": {
        "type": "String"
    },
    "imageUrls": {
        "type": [
            "String"
        ]
    },
    "price": {
        "type": "Number"
    },
    "totalRoomCount": {
        "type": "Number"
    },
    "pplCount": {
        "type": "Number"
    },
    "tags": {
        "type": [
            "String"
        ]
    },

    "availability": [{
        "start": {
            "type": Date
        },
        "end": {
            "type": Date
        },
        "roomCount": {
            "type": "Number"
        },
    }]
}, { timestamps: true });



module.exports = roomSchema;