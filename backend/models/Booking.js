const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true,
        },
        guest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        guests: { type: Number, required: true, min: 1 },
        nights: { type: Number, required: true },
        pricePerNight: { type: Number, required: true },
        cleaningFee: { type: Number, default: 30 },
        serviceFee: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'confirmed',
        },
    },
    { timestamps: true }
);

// Compound index for fast availability lookups
bookingSchema.index({ listing: 1, status: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
