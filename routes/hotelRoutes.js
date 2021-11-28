const express = require('express');
const verifyToken = require('../middleware/auth');
const Discount = require('../models/discountModel');
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
        var hotel = Hotel.create(req.body);
        console.log(hotel);
        hotel.save();
        res.status(201).send("Hotel added to DB successfully!");
    }
});


router.get("/search", async (req, res) => {
    console.log(req.query);
    if (Object.keys(req.query).length !== 0) {

        let { query, type, pFrom, pTo, fromDate, toDate, roomCount } = req.query;
        let allType = false;
        if (query === undefined) query = '';
        if (type === undefined) { type = ["Single-Bed", "Double-Bed", "Triple-Bed"]; allType = true; }
        if (pFrom === undefined) pFrom = 0;
        if (pTo === undefined) pTo = Number.MAX_SAFE_INTEGER
        if (roomCount === undefined) roomCount = 1;
        console.log(query, type, pFrom, pTo);
        const ops = {
            "roomTypes": { $in: type },
            $or: [{ "name": { "$regex": query, "$options": "i" } }, { "location": { "$regex": query, "$options": "i" } }]
        };
        let hotels = await Hotel.find(ops, 'name location desc rating roomPrice rooms.blocked roomCount roomTypes').lean();
        if (hotels.length != 0) {
            let result = hotels.filter((e) => {

                if (!allType)
                    return e['roomPrice'][`${type.split('-')[0]}`] >= pFrom && e.roomPrice[`${type.split('-')[0]}`] <= pTo;
                else {
                    let exist = false;
                    type.forEach((t) => {
                        if (e['roomPrice'][`${t.split('-')[0]}`] >= pFrom && e.roomPrice[`${t.split('-')[0]}`] <= pTo) { exist = true; return true; }
                    });
                    return exist;
                }
            });

            if (!allType) {

                let finalResult = result.filter((hotel) => {
                    let c = 0;
                    if (hotel.rooms[hotel.roomTypes.indexOf(type)].blocked) {
                        hotel.rooms[hotel.roomTypes.indexOf(type)].blocked.forEach((b) => {
                            if (b.from <= fromDate && b.to >= toDate) {
                                c = c + b.roomCount;
                            }
                        });
                    }
                    if (c + roomCount > hotel.roomCount[`${type.split('-')[0]}`]) {
                        return false;
                    }
                    else return true;
                });

                for (let i = 0; i < finalResult.length; i++) {
                    delete finalResult[i].rooms;
                    delete finalResult[i].roomCount;
                }

                res.status(200).send({ success: true, data: finalResult });

            }
            else {
                let finalResult = result.filter((hotel) => {
                    let exist = false;
                    hotel.roomTypes.forEach((t) => {
                        let c = 0;
                        if (hotel.rooms[hotel.roomTypes.indexOf(t)].blocked) {
                            hotel.rooms[hotel.roomTypes.indexOf(t)].blocked.forEach((b) => {
                                if (b.from <= fromDate && b.to >= toDate) {
                                    c = c + b.roomCount;
                                }
                            });
                        }
                        if (c + roomCount <= hotel.roomCount[`${t.split('-')[0]}`]) {
                            exist = true;
                            return true;
                        }
                    });
                    return exist;
                });


                for (let i = 0; i < finalResult.length; i++) {
                    delete finalResult[i].rooms;
                    delete finalResult[i].roomCount;

                }
                res.status(200).send({ success: true, data: finalResult });

            }



        }
        else {
            res.status(404).send({ success: false, error: "No hotels found" });
        }

    }
    else {
        let hotels = await Hotel.find({}, 'name location desc rating');

        if (hotels.length != 0) {
            res.status(200).send({ success: true, data: hotels });
        }
        else {
            res.status(404).send({ success: false, error: "No hotels found" });
        }
    }
});


router.get("/:hotelId", async (req, res) => {

    let hotelData = await Hotel.findById(req.params.hotelId, { "createdAt": 0, "updatedAt": 0, "rooms.createdAt": 0, "rooms.updatedAt": 0 })
        .populate("discounts").lean();
    if (hotelData) {
        let reviews = await Review.find({ hotelId: req.params.hotelId });
        console.log(reviews);
        hotelData['reviews'] = reviews;
        res.status(201).send({ success: true, data: hotelData });
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


router.post("/:hotelId/discounts", async (req, res) => {
    let hotelId = req.params.hotelId;

    if (req.body) {
        let disc = await Discount.create(req.body);
        await Hotel.updateOne({ _id: hotelId }, {
            $push: {
                discounts: disc._id
            }
        });
        res.status(201).send({ success: true, data: disc });
    }
    else {
        res.status(400).send({ success: false, error: "Provide discount body!" });
    }

});


module.exports = router;