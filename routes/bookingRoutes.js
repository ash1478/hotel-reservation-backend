const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const verifyToken = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const Hotel = require('../models/hotelModel');

//Make a booking
router.post("/", verifyToken, async (req, res) => {
    if (req.body) {
        let { hotelId, price, from, to, rooms, discountId } = req.body;
        console.log({ hotelId, price, from, to, rooms });
        let token = req.headers.authorization.split(' ')[1];
        let userId = jwt.decode(token, process.env.TOKEN_KEY)._id;


        const session = await Booking.startSession();

        let order = {};
        let f = true;
        await session.withTransaction(async () => {
            const hotel = await Hotel.findById(hotelId);
            //console.log(hotel);
            const bookings = await Booking.find({
                "hotel": hotelId,
                "fromDate": { $lte: from },
                "toDate": { $gte: to }
            });

            if (bookings.length != 0) {
                console.log("Reached multi");
                rooms.forEach((room) => {
                    let c = 0;
                    bookings.forEach((b) => {
                        b.rooms.forEach((r) => {
                            if (r.roomType === room.roomType) {
                                c = c + r.totalRooms;
                            }
                        });
                    });
                    if (c + room.totalRooms > hotel.roomCount[room.roomType.split("-")[0]]) {
                        f = false;
                        return res.status(400).send({ success: false, error: "Not Available" });
                    }
                });

                if (f) {
                    if(discountId != "null")
                    order = await Booking.create({
                        "hotel": hotelId,
                        "user": userId,
                        "fromDate": from,
                        "toDate": to,
                        "price": price,
                        "rooms": rooms,
                        "discount": discountId
                    });
                    else order = await Booking.create({
                        "hotel": hotelId,
                        "user": userId,
                        "fromDate": from,
                        "toDate": to,
                        "price": price,
                        "rooms": rooms
                    });

                    rooms.forEach(async (r) => {
                        await Hotel.updateOne({ _id: hotel._id, "rooms.type": r.roomType }, {
                            $push: {
                                "rooms.$.blocked": { "from": order.fromDate, "to": order.toDate, "roomCount": r.totalRooms }
                            }
                        });
                    });
                }


                return true;

            }
            else {
                let flag = 0;
                rooms.forEach((room) => {
                    if (room.totalRooms > hotel.roomCount[room.roomType.split("-")[0]]) { flag = 1; }
                });
                if (flag === 0) {
                    if (discountId != "null")
                        order = await Booking.create({
                            "hotel": hotelId,
                            "user": userId,
                            "fromDate": from,
                            "toDate": to,
                            "price": price,
                            "rooms": rooms,
                            "discount": discountId
                        });
                    else order = await Booking.create({
                        "hotel": hotelId,
                        "user": userId,
                        "fromDate": from,
                        "toDate": to,
                        "price": price,
                        "rooms": rooms
                    });
                    rooms.forEach(async (r) => {
                        await Hotel.updateOne({ _id: hotel._id, "rooms.type": r.roomType }, {
                            $push: {
                                "rooms.$.blocked": { "from": order.fromDate, "to": order.toDate, "roomCount": r.totalRooms }
                            }
                        });
                    });

                    return true;
                }
                else {
                    f = false;
                    return res.status(400).send({ success: false, error: "Not Available" });
                }
            }
        });

        await session.endSession();

        if (f) res.status(201).send({ success: true, data: order });

    }
});

//Get booking detail
router.get("/:bookingId", verifyToken, async (req, res) => {

    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId, { "rooms._id": 0 }).populate('hotel', 'name desc imageUrls location rooms').populate('user', { token: 0 })
        .populate('discount');

    if (booking) {
        res.status(200).send({ success: true, data: booking });
    }
    else {
        res.status(400).send({ success: false, error: "No booking available with this Id." });
    }
});

//Cancel booking
router.post("/:bookingId", verifyToken, async (req, res) => {

    const bookingId = req.params.bookingId;

    const booking = await Booking.deleteOne({ _id: bookingId });

    if (booking) {
        res.status(200).send({ success: true, data: booking });
    }
    else {
        res.status(400).send({ success: false, error: "No booking available with this Id." });
    }
});

//List user bookings
router.get("/user/:userId", verifyToken, async (req, res) => {

    let token = req.headers.authorization.split(' ')[1];
    let userId = req.params.userId;
    let user = jwt.decode(token, process.env.TOKEN_KEY);

    if (user._id === userId) {
        let bookings = await Booking.find({ "user": userId }).populate('hotel', 'name imageUrls location');

        if (bookings.length != 0) {
            res.status(201).send({ success: true, data: bookings });
        }
        else {
            res.status(401).send({ success: false, error: "No available bookings for this user." })
        }
    }
    else {
        res.status(401).send({ success: false, error: "Access Denied." })
    }


});


module.exports = router;
