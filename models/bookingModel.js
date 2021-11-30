const mongoose = require('mongoose');
const roomSchema = require("./roomModel");
let Schema = mongoose.Schema;

var bookingSchema = Schema({
    "user": {
        "type": Schema.Types.ObjectId,
        "ref": "user"
    },
    "hotel": {
        "type": Schema.Types.ObjectId,
        "ref" : "hotel"
    },
    "discount": {
        "type": Schema.Types.ObjectId,
        "ref": "discount",
        "required" : false
    },
    "fromDate": {
        "type": "Number"
    },
    "toDate": {
        "type": "Number"
    },
    "rooms": [{
        "roomType": {"type": "String"},
        "totalRooms" : {"type": "Number"}
    }],
    "price": {
        "type": "Number"
    }
});


let Booking = mongoose.model('booking',bookingSchema);

module.exports = Booking;