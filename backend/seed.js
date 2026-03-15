/**
 * Wanderlust – Seed Script
 * Run: node seed.js
 * Seeds the database with demo host + sample property listings.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Review = require('./models/Review');

const DEMO_LISTINGS = [
    {
        title: 'Beachfront Paradise Villa – Goa',
        description:
            'Wake up to the sound of waves in this stunning beachfront villa in North Goa. Nestled right on Calangute Beach, the villa features a private infinity pool, lush tropical gardens, and panoramic Arabian Sea views. Perfect for couples and families seeking a luxurious coastal escape. Enjoy fresh seafood restaurants and vibrant nightlife just steps away.',
        price: 180,
        location: {
            address: '12 Calangute Beach Road',
            city: 'Goa',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [73.7522, 15.5440] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop', publicId: 'demo1a' },
            { url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1200&auto=format&fit=crop', publicId: 'demo1b' },
            { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop', publicId: 'demo1c' },
        ],
        category: 'Beach',
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'AC', 'Balcony'],
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
    },
    {
        title: 'Cozy Pine Cabin – Manali',
        description:
            'A charming wooden cabin set among pine forests with sweeping views of the Himalayan peaks. This intimate retreat in Old Manali is ideal for couples and adventure seekers. Enjoy crackling fireside evenings, wake up to snow-capped mountains, and explore nearby trekking trails, Solang Valley, and Rohtang Pass. A true mountain escape.',
        price: 95,
        location: {
            address: 'Old Manali Village',
            city: 'Manali',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.1892, 32.2396] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop', publicId: 'demo2a' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop', publicId: 'demo2b' },
            { url: 'https://images.unsplash.com/photo-1520637836993-a5b8af31af32?w=1200&auto=format&fit=crop', publicId: 'demo2c' },
        ],
        category: 'Cabin',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Balcony'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Sky-High Luxury Apartment – Mumbai',
        description:
            'Experience Mumbai like never before from this ultra-modern 32nd-floor apartment in Bandra Kurla Complex. Floor-to-ceiling windows offer stunning city skyline views, especially breathtaking at night. The apartment features premium furnishings, a fully equipped gourmet kitchen, and is walking distance from top-notch restaurants, malls, and the financial district.',
        price: 220,
        location: {
            address: 'Bandra Kurla Complex, BKC',
            city: 'Mumbai',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [72.8656, 19.0622] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop', publicId: 'demo3a' },
            { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop', publicId: 'demo3b' },
            { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop', publicId: 'demo3c' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Gym', 'TV', 'Washer'],
        maxGuests: 3,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Heritage Haveli – Jaipur',
        description:
            'Step back in time in this beautifully restored 18th-century Rajasthani haveli in the heart of the Pink City. Ornate frescoes, arched doorways, a central courtyard with a fountain, and rooftop terrace overlooking the city create an unmatched heritage experience. Walk to Hawa Mahal, City Palace, and Jantar Mantar.',
        price: 135,
        location: {
            address: 'Chandpole Bazaar, Old City',
            city: 'Jaipur',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [75.8235, 26.9124] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop', publicId: 'demo4a' },
            { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop', publicId: 'demo4b' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'AC', 'Balcony', 'Kitchen', 'Parking'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        title: 'Treehouse Retreat – Coorg',
        description:
            'Live among the treetops in this magical bamboo treehouse nestled in a coffee plantation in Coorg, Karnataka. Listen to birdsong at dawn, sip freshly brewed estate coffee, and explore misty forest trails. A truly unique eco-stay with stunning plantation views and complete serenity.',
        price: 110,
        location: {
            address: 'Madikeri Coffee Estate',
            city: 'Coorg',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [75.7382, 12.3375] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop', publicId: 'demo5a' },
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop', publicId: 'demo5b' },
        ],
        category: 'Treehouse',
        amenities: ['WiFi', 'Balcony', 'Kitchen', 'Pet friendly'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Lakeside Cottage – Nainital',
        description:
            'A quaint colonial-style cottage right on the banks of Naini Lake, in the hills of Uttarakhand. Row a boat at sunrise, explore the Mall Road, ride the Nainital cable car, and enjoy mountain views from your private porch. The cottage has a fully equipped kitchen and cozy interiors with period furnishings.',
        price: 88,
        location: {
            address: 'Lake Side Road, Mallital',
            city: 'Nainital',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [79.4616, 29.3919] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop', publicId: 'demo6a' },
            { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop', publicId: 'demo6b' },
        ],
        category: 'Countryside',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Balcony', 'Fireplace'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Desert Camp Glamping – Jaisalmer',
        description:
            'Sleep under a billion stars in this premium desert glamping camp in the Thar Desert, near the golden city of Jaisalmer. Luxury Swiss tents with proper beds, attached bathrooms, and evening cultural programs including folk music and camel safaris at sunset. A bucket-list experience.',
        price: 160,
        location: {
            address: 'Sam Sand Dunes, Thar Desert',
            city: 'Jaisalmer',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [70.9083, 26.9157] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop', publicId: 'demo7a' },
            { url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&auto=format&fit=crop', publicId: 'demo7b' },
        ],
        category: 'Desert',
        amenities: ['AC', 'Balcony', 'Pet friendly'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Backwater Houseboat – Kerala',
        description:
            'Drift through lush paddy fields, coconut groves, and mirror-still backwaters on this traditional Kerala kettuvallam houseboat. The fully staffed boat includes a private chef serving authentic Kerala cuisine, a cozy bedroom with AC, and an open-air dining deck. Cruise the Alleppey backwaters – the Venice of the East.',
        price: 200,
        location: {
            address: 'Vembanad Lake, Alleppey',
            city: 'Alleppey',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.3388, 9.4981] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop', publicId: 'demo8a' },
            { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop', publicId: 'demo8b' },
        ],
        category: 'Island',
        amenities: ['AC', 'Kitchen', 'TV'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
];

const DEMO_REVIEWS = [
    { rating: 5, comment: 'Absolutely breathtaking! The location was even more beautiful than the photos. Will definitely come back.' },
    { rating: 5, comment: 'Perfect stay. The host was incredibly helpful and the amenities were top notch. Highly recommend!' },
    { rating: 4, comment: 'Great property with stunning views. A few minor things could be improved but overall a fantastic experience.' },
    { rating: 5, comment: 'One of the best travel experiences of my life. The property is magical and the surroundings are stunning.' },
    { rating: 4, comment: 'Very comfortable and well-equipped. The location is unbeatable. Would love to come back in a different season.' },
];

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!\n');

        // Clear existing demo data
        await Listing.deleteMany({ isFeatured: true });
        console.log('🗑️  Cleared old demo listings\n');

        // Create or find demo host user
        let demoHost = await User.findOne({ email: 'demo@wanderlust.com' });
        if (!demoHost) {
            demoHost = await User.create({
                name: 'Wanderlust Team',
                email: 'demo@wanderlust.com',
                password: 'demo1234',  // Will be hashed by pre-save hook
                bio: 'Official Wanderlust curator. We handpick the most unique stays across India and the world.',
            });
            console.log('👤 Created demo host:', demoHost.email);
        } else {
            console.log('👤 Using existing demo host:', demoHost.email);
        }

        // Create a second reviewer user
        let reviewer = await User.findOne({ email: 'traveller@wanderlust.com' });
        if (!reviewer) {
            reviewer = await User.create({
                name: 'Happy Traveller',
                email: 'traveller@wanderlust.com',
                password: 'travel1234',
            });
        }

        // Insert listings
        console.log('\n📍 Seeding listings...');
        const created = [];
        for (const data of DEMO_LISTINGS) {
            const listing = await Listing.create({
                ...data,
                host: demoHost._id,
                isFeatured: true,
            });
            created.push(listing);
            console.log(`  ✅ ${listing.title}`);
        }

        // Add reviews to first 5 listings
        console.log('\n⭐ Adding sample reviews...');
        for (let i = 0; i < Math.min(5, created.length); i++) {
            const review = DEMO_REVIEWS[i];
            try {
                await Review.create({
                    listing: created[i]._id,
                    author: reviewer._id,
                    rating: review.rating,
                    comment: review.comment,
                });
                console.log(`  ⭐ Review added to: ${created[i].title}`);
            } catch (e) {
                // Skip duplicate review errors
            }
        }

        console.log('\n🎉 Seeding complete!');
        console.log(`   ${created.length} listings created`);
        console.log(`   Demo host: demo@wanderlust.com / demo1234`);
        console.log(`   Traveller: traveller@wanderlust.com / travel1234`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
