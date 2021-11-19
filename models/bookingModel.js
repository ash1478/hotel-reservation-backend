const mongoose = require('mongoose');
const roomSchema = require("./roomModel");
let Schema = mongoose.Schema;

var bookingSchema = Schema({
    "userId": {
        "type": Schema.Types.ObjectId,
        "ref": "user"
    },
    "hotelId": {
        "type": Schema.Types.ObjectId,
        "ref" : "hotel"
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