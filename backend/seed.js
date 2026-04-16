/**
 * Wanderlust – Seed Script
 * Run: node seed.js
 * Seeds the database with demo host + 20 sample listings (2 per category).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Review = require('./models/Review');

// 20 listings — 2 per each of the 10 categories
const DEMO_LISTINGS = [

    // ---- BEACH (2) ----
    {
        title: 'Beachfront Paradise Villa – Goa',
        description: 'Wake up to the sound of waves in this stunning beachfront villa in North Goa. Nestled right on Calangute Beach, the villa features a private infinity pool, lush tropical gardens, and panoramic Arabian Sea views. Perfect for couples and families seeking a luxurious coastal escape. Fresh seafood restaurants and vibrant nightlife are just steps away.',
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
        ],
        category: 'Beach',
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'AC', 'Balcony'],
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
    },
    {
        title: 'Cliff Beach House – Varkala',
        description: 'Perched on the dramatic red laterite cliffs of Varkala, this breezy beach house offers uninterrupted views of the Arabian Sea. Watch sunsets turn the sky orange from your private terrace, take the cliff-side path down to the beach for a morning swim, or just relax with a coconut water. Walking distance from local shacks, yoga studios, and ayurvedic spas.',
        price: 105,
        location: {
            address: 'North Cliff, Varkala Beach',
            city: 'Varkala',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.7160, 8.7379] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop', publicId: 'demo2a' },
            { url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&auto=format&fit=crop', publicId: 'demo2b' },
        ],
        category: 'Beach',
        amenities: ['WiFi', 'Balcony', 'Kitchen', 'AC'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },

    // ---- MOUNTAINS (2) ----
    {
        title: 'Snow Peak Chalet – Shimla',
        description: 'A classic colonial-era chalet tucked into the forested hillsides above Shimla. Wake up to crisp mountain air and panoramic views of snow-dusted Himalayan peaks. The chalet has a warm fireplace, handcrafted wooden furniture, and a sun-drenched veranda perfect for morning tea. Great base for Kufri day trips, Mall Road strolls, and Jakhu Temple visits.',
        price: 130,
        location: {
            address: 'Chota Shimla, Near Jakhu Temple',
            city: 'Shimla',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.1734, 31.1048] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop', publicId: 'demo3a' },
            { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop', publicId: 'demo3b' },
        ],
        category: 'Mountains',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Balcony'],
        maxGuests: 5,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Tea Garden Bungalow – Darjeeling',
        description: 'A charming heritage bungalow nestled inside a working tea estate on the outskirts of Darjeeling. Early risers can join the tea pluckers at dawn, watch the sunrise over Kanchenjunga from the garden, and sip the freshest first-flush Darjeeling tea straight from the source. The quiet mist-wrapped surroundings make this an ideal digital detox retreat.',
        price: 120,
        location: {
            address: 'Happy Valley Tea Estate',
            city: 'Darjeeling',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [88.2636, 27.0410] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop', publicId: 'demo4a' },
            { url: 'https://images.unsplash.com/photo-1520637836993-a5b8af31af32?w=1200&auto=format&fit=crop', publicId: 'demo4b' },
        ],
        category: 'Mountains',
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Fireplace'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },

    // ---- CITY (2) ----
    {
        title: 'Sky-High Luxury Apartment – Mumbai',
        description: 'Experience Mumbai like never before from this ultra-modern 32nd-floor apartment in Bandra Kurla Complex. Floor-to-ceiling windows offer stunning city skyline views, especially breathtaking at night. Features premium furnishings, a fully equipped gourmet kitchen, and is walking distance from top-notch restaurants, malls, and the financial district.',
        price: 220,
        location: {
            address: 'Bandra Kurla Complex, BKC',
            city: 'Mumbai',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [72.8656, 19.0622] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop', publicId: 'demo5a' },
            { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop', publicId: 'demo5b' },
        ],
        category: 'City',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Gym', 'TV', 'Washer'],
        maxGuests: 3,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Heritage Loft – Old Delhi',
        description: 'A beautifully restored loft apartment hidden inside a 200-year-old merchant haveli in the lanes of Old Delhi. Original arched windows, exposed brick walls, and antique wooden beams have been carefully preserved, while modern amenities ensure a comfortable stay. Step outside and you are right in the thick of Chandni Chowk, the spice markets, and Jama Masjid.',
        price: 98,
        location: {
            address: 'Chandni Chowk, Old Delhi',
            city: 'Delhi',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.2310, 28.6562] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop', publicId: 'demo6a' },
            { url: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&auto=format&fit=crop', publicId: 'demo6b' },
        ],
        category: 'City',
        amenities: ['WiFi', 'AC', 'Kitchen', 'TV'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ---- COUNTRYSIDE (2) ----
    {
        title: 'Lakeside Cottage – Nainital',
        description: 'A quaint colonial-style cottage right on the banks of Naini Lake in the hills of Uttarakhand. Row a boat at sunrise, explore the Mall Road, ride the Nainital cable car, and enjoy mountain views from your private porch. The cottage has a fully equipped kitchen and cozy interiors with period furnishings.',
        price: 88,
        location: {
            address: 'Lake Side Road, Mallital',
            city: 'Nainital',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [79.4616, 29.3919] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop', publicId: 'demo7a' },
            { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop', publicId: 'demo7b' },
        ],
        category: 'Countryside',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Balcony', 'Fireplace'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Mustard Fields Homestay – Amritsar',
        description: 'A warm family-run farmstay set in the golden mustard fields of rural Punjab, just 30 km from Amritsar. Wake up to birdsong, help collect fresh eggs, enjoy home-cooked Punjabi meals with the host family, and make a sunrise visit to the Golden Temple. An authentic slice of village life in one of India\'s most soulful regions.',
        price: 65,
        location: {
            address: 'Village Chheharta, Amritsar District',
            city: 'Amritsar',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [74.8728, 31.6340] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop', publicId: 'demo8a' },
            { url: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1200&auto=format&fit=crop', publicId: 'demo8b' },
        ],
        category: 'Countryside',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Pet friendly'],
        maxGuests: 5,
        bedrooms: 2,
        bathrooms: 1,
    },

    // ---- DESERT (2) ----
    {
        title: 'Desert Camp Glamping – Jaisalmer',
        description: 'Sleep under a billion stars in this premium desert glamping camp in the Thar Desert, near the golden city of Jaisalmer. Luxury Swiss tents with proper beds, attached bathrooms, and evening cultural programs including folk music and camel safaris at sunset. A bucket-list experience.',
        price: 160,
        location: {
            address: 'Sam Sand Dunes, Thar Desert',
            city: 'Jaisalmer',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [70.9083, 26.9157] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop', publicId: 'demo9a' },
            { url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&auto=format&fit=crop', publicId: 'demo9b' },
        ],
        category: 'Desert',
        amenities: ['AC', 'Balcony', 'Pet friendly'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Royal Tent Suite – Bikaner',
        description: 'A regal glamping experience in the heart of the Thar, set near the magnificent Junagarh Fort of Bikaner. The hand-embroidered maharaja tent blends traditional Rajasthani craftsmanship with modern comfort — plush beds, ornate sitting area, and an open-top bathroom under the night sky. Camel rides, sand dune walks, and traditional puppet shows are arranged every evening.',
        price: 140,
        location: {
            address: 'Camel Safari Camp, Near Junagarh Fort',
            city: 'Bikaner',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [73.3119, 28.0229] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&auto=format&fit=crop', publicId: 'demo10a' },
            { url: 'https://images.unsplash.com/photo-1484821582734-6692f4ec3c9c?w=1200&auto=format&fit=crop', publicId: 'demo10b' },
        ],
        category: 'Desert',
        amenities: ['AC', 'Balcony'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ---- ARCTIC (2) ----
    {
        title: 'Glass Igloo Suite – Rovaniemi',
        description: 'Experience the ultimate Arctic dream in this transparent glass igloo perched on a frozen lake in Finnish Lapland. Lie back in bed and watch the Northern Lights dance across the sky through your panoramic glass ceiling. Heated floors, a private sauna, and a dedicated Aurora alert service ensure the most magical winter stay. Santa\'s Village is just 8 km away.',
        price: 480,
        location: {
            address: 'Arctic Lake Resort, Rovaniemi',
            city: 'Rovaniemi',
            country: 'Finland',
            coordinates: { type: 'Point', coordinates: [25.7482, 66.5039] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop', publicId: 'demo11a' },
            { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop', publicId: 'demo11b' },
        ],
        category: 'Arctic',
        amenities: ['WiFi', 'Fireplace', 'TV', 'Hot tub'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Northern Lights Cabin – Tromsø',
        description: 'A cozy A-frame log cabin on the outskirts of Tromsø, Norway — one of the world\'s best places to see the Aurora Borealis. Full-length north-facing windows for Aurora viewing from your sofa, a wood-burning stove, and a private hot tub for stargazing in the snow. Whale-watching tours and the Tromsø ice domes are within 20 minutes.',
        price: 390,
        location: {
            address: 'Kvaløya Island, Tromsø',
            city: 'Tromsø',
            country: 'Norway',
            coordinates: { type: 'Point', coordinates: [18.9553, 69.6496] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=1200&auto=format&fit=crop', publicId: 'demo12a' },
            { url: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200&auto=format&fit=crop', publicId: 'demo12b' },
        ],
        category: 'Arctic',
        amenities: ['WiFi', 'Fireplace', 'Hot tub', 'Parking'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },

    // ---- LUXURY (2) ----
    {
        title: 'Heritage Haveli – Jaipur',
        description: 'Step back in time in this beautifully restored 18th-century Rajasthani haveli in the heart of the Pink City. Ornate frescoes, arched doorways, a central courtyard with a fountain, and a rooftop terrace overlooking the city create an unmatched heritage experience. Walk to Hawa Mahal, City Palace, and Jantar Mantar.',
        price: 135,
        location: {
            address: 'Chandpole Bazaar, Old City',
            city: 'Jaipur',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [75.8235, 26.9124] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop', publicId: 'demo13a' },
            { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop', publicId: 'demo13b' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'AC', 'Balcony', 'Kitchen', 'Parking'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        title: 'Private Pool Villa – Udaipur',
        description: 'A stunning lakeside villa with a private infinity pool overlooking the shimmering waters of Lake Pichola and the City Palace of Udaipur. Impeccably designed with Rajasthani marble, hand-painted murals, and bougainvillea-draped terraces. Butler service and a private chef on request can be arranged. The most romantic stay in Rajasthan.',
        price: 380,
        location: {
            address: 'Lake Pichola Waterfront, Hanuman Ghat',
            city: 'Udaipur',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [73.6833, 24.5764] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop', publicId: 'demo14a' },
            { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop', publicId: 'demo14b' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'Pool', 'AC', 'Kitchen', 'Balcony', 'Hot tub'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },

    // ---- CABIN (2) ----
    {
        title: 'Cozy Pine Cabin – Manali',
        description: 'A charming wooden cabin set among pine forests with sweeping views of the Himalayan peaks. This intimate retreat in Old Manali is ideal for couples and adventure seekers. Enjoy crackling fireside evenings, wake up to snow-capped mountains, and explore nearby trekking trails and Rohtang Pass. A true mountain escape.',
        price: 95,
        location: {
            address: 'Old Manali Village',
            city: 'Manali',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.1892, 32.2396] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop', publicId: 'demo15a' },
            { url: 'https://images.unsplash.com/photo-1520637836993-a5b8af31af32?w=1200&auto=format&fit=crop', publicId: 'demo15b' },
        ],
        category: 'Cabin',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Balcony'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Log Cabin by the River – Kasol',
        description: 'A rustic hand-built log cabin sitting right on the banks of the Parvati River in Kasol, the trekking capital of Himachal Pradesh. Fall asleep to the sound of rushing glacial water, wake up to snow-tipped peaks, and spend your days on the Kheerganga or Pin Parbati trails. Simple but cozy kitchen and a wood-heated shower.',
        price: 75,
        location: {
            address: 'Parvati Valley, Near Kasol Village',
            city: 'Kasol',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.3162, 32.0094] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop', publicId: 'demo16a' },
            { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop', publicId: 'demo16b' },
        ],
        category: 'Cabin',
        amenities: ['Kitchen', 'Fireplace', 'Pet friendly'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ---- TREEHOUSE (2) ----
    {
        title: 'Treehouse Retreat – Coorg',
        description: 'Live among the treetops in this magical bamboo treehouse nestled in a coffee plantation in Coorg, Karnataka. Listen to birdsong at dawn, sip freshly brewed estate coffee, and explore misty forest trails. A truly unique eco-stay with stunning plantation views and complete serenity.',
        price: 110,
        location: {
            address: 'Madikeri Coffee Estate',
            city: 'Coorg',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [75.7382, 12.3375] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop', publicId: 'demo17a' },
            { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop', publicId: 'demo17b' },
        ],
        category: 'Treehouse',
        amenities: ['WiFi', 'Balcony', 'Kitchen', 'Pet friendly'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Jungle Canopy Suite – Wayanad',
        description: 'A stunning two-storey treehouse built around a 200-year-old jungle tree inside a private wildlife reserve in Wayanad, Kerala. Open bamboo walls let you hear elephants in the night. The upper deck has a stargazing platform with a telescope. Guided jungle walks, tribal village tours, and a naturalist-led night safari are all included in the stay.',
        price: 145,
        location: {
            address: 'Tholpetty Wildlife Reserve, Wayanad',
            city: 'Wayanad',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.1320, 11.6854] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop', publicId: 'demo18a' },
            { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop', publicId: 'demo18b' },
        ],
        category: 'Treehouse',
        amenities: ['Balcony', 'Kitchen', 'Pet friendly'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ---- ISLAND (2) ----
    {
        title: 'Backwater Houseboat – Kerala',
        description: 'Drift through lush paddy fields, coconut groves, and mirror-still backwaters on this traditional Kerala kettuvallam houseboat. The fully staffed boat includes a private chef serving authentic Kerala cuisine, a cozy bedroom with AC, and an open-air dining deck. Cruise the Alleppey backwaters — the Venice of the East.',
        price: 200,
        location: {
            address: 'Vembanad Lake, Alleppey',
            city: 'Alleppey',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.3388, 9.4981] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop', publicId: 'demo19a' },
            { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop', publicId: 'demo19b' },
        ],
        category: 'Island',
        amenities: ['AC', 'Kitchen', 'TV'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Private Beach Bungalow – Andaman',
        description: 'A secluded beachfront bungalow on a near-private stretch of Havelock Island in the Andaman archipelago. Step directly onto powdery white sand and wade into the clearest turquoise water you have ever seen. Snorkelling gear, kayaks, and a glass-bottom boat tour are included. Nearest village is 3 km away — true barefoot-luxury isolation.',
        price: 260,
        location: {
            address: 'Radhanagar Beach, Havelock Island',
            city: 'Port Blair',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [92.9376, 11.9810] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop', publicId: 'demo20a' },
            { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&auto=format&fit=crop', publicId: 'demo20b' },
        ],
        category: 'Island',
        amenities: ['WiFi', 'AC', 'Balcony', 'Kitchen'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
];

const DEMO_REVIEWS = [
    { rating: 5, comment: 'Absolutely breathtaking! The location was even more beautiful than the photos. Will definitely come back.' },
    { rating: 5, comment: 'Perfect stay. The host was incredibly helpful and the amenities were top notch. Highly recommend!' },
    { rating: 4, comment: 'Great property with stunning views. A few minor things could be improved but overall a fantastic experience.' },
    { rating: 5, comment: 'One of the best travel experiences of my life. The property is magical and the surroundings are stunning.' },
    { rating: 4, comment: 'Very comfortable and well-equipped. The location is unbeatable. Would love to come back in a different season.' },
    { rating: 5, comment: 'Hidden gem! We were the only guests and it felt like our own private retreat. Loved every minute.' },
    { rating: 4, comment: 'Great value for money. Exactly as described and the host responded quickly to every message.' },
    { rating: 5, comment: 'Woke up to the most incredible sunrise view. The property is even better in person than in the photos.' },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!\n');

        // clear old demo data
        await Listing.deleteMany({ isFeatured: true });
        console.log('Cleared old demo listings\n');

        // create or find demo host
        let demoHost = await User.findOne({ email: 'demo@wanderlust.com' });
        if (!demoHost) {
            demoHost = await User.create({
                name: 'Wanderlust Team',
                email: 'demo@wanderlust.com',
                password: 'demo1234',
                bio: 'Official Wanderlust curator. We handpick the most unique stays across India and the world.',
            });
            console.log('Created demo host:', demoHost.email);
        } else {
            console.log('Using existing demo host:', demoHost.email);
        }

        // reviewer user for sample reviews
        let reviewer = await User.findOne({ email: 'traveller@wanderlust.com' });
        if (!reviewer) {
            reviewer = await User.create({
                name: 'Happy Traveller',
                email: 'traveller@wanderlust.com',
                password: 'travel1234',
            });
        }

        // insert all 20 listings
        console.log('\nSeeding listings...');
        const created = [];
        for (const data of DEMO_LISTINGS) {
            const listing = await Listing.create({
                ...data,
                host: demoHost._id,
                isFeatured: true,
            });
            created.push(listing);
            console.log(`  + ${listing.title} [${listing.category}]`);
        }

        // add reviews to first 8 listings
        console.log('\nAdding sample reviews...');
        for (let i = 0; i < Math.min(DEMO_REVIEWS.length, created.length); i++) {
            try {
                await Review.create({
                    listing: created[i]._id,
                    author: reviewer._id,
                    rating: DEMO_REVIEWS[i].rating,
                    comment: DEMO_REVIEWS[i].comment,
                });
                console.log(`  review -> ${created[i].title}`);
            } catch (e) {
                // skip duplicate review errors silently
            }
        }

        console.log('\nDone!');
        console.log(`  ${created.length} listings created (2 per category)`);
        console.log(`  Host login:     demo@wanderlust.com / demo1234`);
        console.log(`  Traveller login: traveller@wanderlust.com / travel1234`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
