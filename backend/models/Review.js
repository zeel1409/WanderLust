const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
            maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
    },
    { timestamps: true }
);

// Prevent duplicate reviews from the same user on the same listing
reviewSchema.index({ listing: 1, author: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
