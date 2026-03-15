const express = require('express');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

// GET /api/listings  – supports ?location=, ?category=, ?minPrice=, ?maxPrice=
router.get('/', async (req, res) => {
    try {
        const { location, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
        const filter = {};

        if (location) {
            filter.$or = [
                { 'location.city': { $regex: location, $options: 'i' } },
                { 'location.country': { $regex: location, $options: 'i' } },
                { 'location.address': { $regex: location, $options: 'i' } },
                { title: { $regex: location, $options: 'i' } },
            ];
        }
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Listing.countDocuments(filter);
        const listings = await Listing.find(filter)
            .populate('host', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        // Compute average rating for each listing
        const listingsWithRating = await Promise.all(
            listings.map(async (listing) => {
                const reviews = await Review.find({ listing: listing._id });
                const avg =
                    reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;
                return { ...listing.toObject(), averageRating: avg, reviewCount: reviews.length };
            })
        );

        res.json({ success: true, total, page: Number(page), listings: listingsWithRating });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/listings  – create listing (protected, multipart)
router.post('/', protect, upload.array('images', 10), async (req, res) => {
    try {
        const { title, description, price, address, city, country, lng, lat, category, amenities, maxGuests, bedrooms, bathrooms } = req.body;

        const images = req.files
            ? req.files.map((f) => ({ url: f.path, publicId: f.filename }))
            : [];

        const listing = await Listing.create({
            title,
            description,
            price: Number(price),
            location: {
                address,
                city,
                country,
                coordinates: { type: 'Point', coordinates: [Number(lng) || 0, Number(lat) || 0] },
            },
            images,
            host: req.user._id,
            category,
            amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
            maxGuests: Number(maxGuests) || 2,
            bedrooms: Number(bedrooms) || 1,
            bathrooms: Number(bathrooms) || 1,
        });

        await listing.populate('host', 'name avatar');
        res.status(201).json({ success: true, listing });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('host', 'name avatar bio createdAt');
        if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });

        const reviews = await Review.find({ listing: listing._id })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });
        const avg =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        res.json({
            success: true,
            listing: { ...listing.toObject(), reviews, averageRating: avg, reviewCount: reviews.length },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/listings/:id  – update (protected, owner only)
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
        if (listing.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        const { title, description, price, address, city, country, lng, lat, category, amenities, maxGuests, bedrooms, bathrooms } = req.body;

        const newImages = req.files ? req.files.map((f) => ({ url: f.path, publicId: f.filename })) : [];
        const existingImages = listing.images;

        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.price = price ? Number(price) : listing.price;
        listing.location = {
            address: address || listing.location.address,
            city: city || listing.location.city,
            country: country || listing.location.country,
            coordinates: {
                type: 'Point',
                coordinates: [Number(lng) || listing.location.coordinates.coordinates[0], Number(lat) || listing.location.coordinates.coordinates[1]],
            },
        };
        listing.category = category || listing.category;
        listing.amenities = amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : listing.amenities;
        listing.maxGuests = maxGuests ? Number(maxGuests) : listing.maxGuests;
        listing.bedrooms = bedrooms ? Number(bedrooms) : listing.bedrooms;
        listing.bathrooms = bathrooms ? Number(bathrooms) : listing.bathrooms;
        listing.images = newImages.length > 0 ? [...existingImages, ...newImages] : existingImages;

        await listing.save();
        await listing.populate('host', 'name avatar');
        res.json({ success: true, listing });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/listings/:id  (protected, owner only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
        if (listing.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        // Clean up Cloudinary images
        if (listing.images && listing.images.length > 0) {
            await Promise.allSettled(
                listing.images
                    .filter((img) => img.publicId)
                    .map((img) => cloudinary.uploader.destroy(img.publicId))
            );
        }

        await Listing.findByIdAndDelete(req.params.id);
        await Review.deleteMany({ listing: req.params.id });
        res.json({ success: true, message: 'Listing deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
