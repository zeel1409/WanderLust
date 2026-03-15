const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [1, 'Price must be at least 1'],
        },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
            coordinates: {
                type: { type: String, enum: ['Point'], default: 'Point' },
                coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
            },
        },
        images: [
            {
                url: String,
                publicId: String,
            },
        ],
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            enum: ['Beach', 'Mountains', 'City', 'Countryside', 'Desert', 'Arctic', 'Luxury', 'Cabin', 'Treehouse', 'Island'],
            default: 'City',
        },
        amenities: [{ type: String }],
        maxGuests: { type: Number, default: 2, min: 1 },
        bedrooms: { type: Number, default: 1, min: 0 },
        bathrooms: { type: Number, default: 1, min: 0 },
        isFeatured: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);



// Index for location search
listingSchema.index({ 'location.coordinates': '2dsphere' });
listingSchema.index({ 'location.city': 'text', 'location.country': 'text', title: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
