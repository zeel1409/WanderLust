const express = require('express');
const Review = require('../models/Review');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// POST /api/listings/:id/reviews
router.post('/', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
        }
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });

        // Prevent host from reviewing their own listing
        if (listing.host.toString() === req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You cannot review your own listing.' });
        }

        const review = await Review.create({
            listing: req.params.id,
            author: req.user._id,
            rating: Number(rating),
            comment,
        });
        await review.populate('author', 'name avatar');
        res.status(201).json({ success: true, review });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this listing.' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/listings/:id/reviews/:reviewId
router.delete('/:reviewId', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
        if (review.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }
        await Review.findByIdAndDelete(req.params.reviewId);
        res.json({ success: true, message: 'Review deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
