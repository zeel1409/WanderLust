const express = require('express');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// POST /api/bookings — create a booking
// ─────────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, guests } = req.body;

        if (!listingId || !checkIn || !checkOut || !guests) {
            return res.status(400).json({ success: false, message: 'listingId, checkIn, checkOut and guests are required.' });
        }

        // 1. Fetch listing
        const listing = await Listing.findById(listingId).populate('host', 'name');
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        // 2. Prevent host from booking their own listing
        if (listing.host._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot book your own listing.' });
        }

        // 3. Validate dates
        const inDate  = new Date(checkIn);
        const outDate = new Date(checkOut);
        const today   = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(inDate) || isNaN(outDate)) {
            return res.status(400).json({ success: false, message: 'Invalid date format.' });
        }
        if (inDate < today) {
            return res.status(400).json({ success: false, message: 'Check-in date cannot be in the past.' });
        }
        if (inDate >= outDate) {
            return res.status(400).json({ success: false, message: 'Check-out must be after check-in.' });
        }

        // 4. Check guest count
        const guestCount = Number(guests);
        if (guestCount < 1 || guestCount > listing.maxGuests) {
            return res.status(400).json({
                success: false,
                message: `Guest count must be between 1 and ${listing.maxGuests}.`,
            });
        }

        // 5. Availability check — look for overlapping confirmed/pending bookings
        const conflict = await Booking.findOne({
            listing: listingId,
            status: { $in: ['confirmed', 'pending'] },
            $or: [
                { checkIn: { $lt: outDate }, checkOut: { $gt: inDate } },
            ],
        });
        if (conflict) {
            return res.status(409).json({
                success: false,
                message: 'These dates are already booked. Please choose different dates.',
            });
        }

        // 6. Price calculation
        const nights      = Math.ceil((outDate - inDate) / 86400000);
        const cleaningFee = 30;
        const serviceFee  = Math.round(listing.price * nights * 0.12);
        const totalPrice  = listing.price * nights + cleaningFee + serviceFee;

        // 7. Create booking
        const booking = await Booking.create({
            listing: listingId,
            guest:   req.user._id,
            checkIn:  inDate,
            checkOut: outDate,
            guests:   guestCount,
            nights,
            pricePerNight: listing.price,
            cleaningFee,
            serviceFee,
            totalPrice,
        });

        await booking.populate([
            { path: 'listing', select: 'title images location price' },
            { path: 'guest',   select: 'name email' },
        ]);

        res.status(201).json({ success: true, booking });
    } catch (err) {
        console.error('Booking create error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────
// GET /api/bookings/my — current user's bookings (newest first)
// ─────────────────────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.user._id })
            .populate('listing', 'title images location price')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────
// GET /api/bookings/listing/:id — booked date ranges for a listing (public)
// Used by frontend to disable already-booked dates
// ─────────────────────────────────────────────────────────────
router.get('/listing/:id', async (req, res) => {
    try {
        const bookings = await Booking.find({
            listing: req.params.id,
            status:  { $in: ['confirmed', 'pending'] },
            checkOut: { $gte: new Date() },
        }).select('checkIn checkOut');
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/bookings/:id — cancel a booking
// ─────────────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        if (booking.guest.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
        }
        booking.status = 'cancelled';
        await booking.save();
        res.json({ success: true, message: 'Booking cancelled successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
