const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var reviewSchema = Schema({
    "hotelId":{
        "type": Schema.Types.ObjectId,
        "ref": "hotel"
    },
    "title": {
        "type": "String"
    },
    "desc": {
        "type": "String"
    },
    "author": {
        "type": Schema.Types.ObjectId,
        "ref": "user"
    }
},{timestamps:true});

let Review = mongoose.model('review', reviewSchema);

module.exports = Review;