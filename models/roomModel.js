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

    "blocked": [{
        "from": {
            "type": "Number"
        },
        "to": {
            "type": "Number"
        },
        "roomCount": {
            "type": "Number"
        },
    }]
}, { timestamps: true });



module.exports = roomSchema;