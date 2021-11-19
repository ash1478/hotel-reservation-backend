const express = require('express');
const verifyToken = require('../middleware/auth');
const Hotel = require('../models/hotelModel');
const Review = require('../models/reviewModel');
const router = express.Router();


router.get("/", (req, res) => {
    Hotel.find({}, 'name location desc rating', (err, hotels) => {
        if (hotels.length != 0) {
            res.status(200).send({ success: true, data: hotels });
        }
        else {
            res.status(404).send({ success: false, error: "No hotels found" });
        }
    });
});

router.post("/", (req, res) => {
    if (req.body) {
        var hotel = Hotel(req.body);
        console.log(hotel);
        hotel.save();
        res.status(201).send("Hotel added to DB successfully!");
    }
});


router.get("/search", (req, res) => {
    console.log(req.query);
    if (Object.keys(req.query).length !== 0) {

        let { query, type, pFrom, pTo } = req.query;

        if (query === undefined) query = '';
        if (type === undefined) type = ["Single-Bed", "Double-Bed", "Triple-Bed"];
        if (pFrom === undefined) pFrom = 0;
        if (pTo === undefined) pTo = Number.MAX_SAFE_INTEGER
        console.log(query, type, pFrom, pTo);
        const ops = {
            "roomTypes": { $in: [type] },
            $or: [{ "name": { "$regex": query, "$options": "i" } }, { "location": { "$regex": query, "$options": "i" } }]
        };
        Hotel.find(ops, 'name location desc rating roomPrice', (err, hotels) => {
            if (hotels.length != 0) {

                let result = hotels.filter((e) => {
                    return e['roomPrice'][`${type.split('-')[0]}`] >= pFrom && e.roomPrice[`${type.split('-')[0]}`] <= pTo;
                });

                res.status(200).send({ success: true, data: result });
            }
            else {
                res.status(404).send({ success: false, error: "No hotels found" });
            }
        });
    }
    else {
        Hotel.find({}, 'name location desc rating', (err, hotels) => {
            if (hotels.length != 0) {
                res.status(200).send({ success: true, data: hotels });
            }
            else {
                res.status(404).send({ success: false, error: "No hotels found" });
            }
        });
    }
});


router.get("/:hotelId", async (req, res) => {

    let hotelData = await Hotel.findById(req.params.hotelId, { "createdAt": 0, "updatedAt": 0, "rooms.createdAt": 0, "rooms.updatedAt": 0 }).lean();
    if (hotelData) {
        let reviews = await Review.find({ hotelId: req.params.hotelId });
        console.log(reviews);
        hotelData['reviews'] = reviews;
        res.status(404).send({ success: true, data: hotelData });
    }
    else {
        res.status(404).send({ success: false, error: "No hotel found" });
    }
});


router.post("/:hotelId/review", verifyToken, async (req, res) => {
    let hotelId = req.params.hotelId;

    let reviewPayload = req.body;
    reviewPayload['hotelId'] = hotelId;

    let review = await Review.create(reviewPayload);

    if (review) {
        res.status(201).send({ success: true, data: review });
    }
    else {
        res.status(400).send({ success: false, error: "Unknown error occured!" });
    }
});


router.get("/:hotelId/review", async (req, res) => {
    let hotelId = req.params.hotelId;

    let reviews = await Review.find({ hotelId: hotelId });

    if (reviews.length != 0) {
        res.status(201).send({ success: true, data: reviews });
    }
    else {
        res.status(400).send({ success: false, error: "No reviews for this hotel" });
    }

});


module.exports = router;