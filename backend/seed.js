/**
 * Wanderlust – Seed Script
 * Run: node seed.js
 * Seeds the database with demo host + 40 realistic sample listings (4 per category).
 * Prices are in Indian Rupees (₹).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Review = require('./models/Review');

const DEMO_LISTINGS = [
    // ==========================================
    // ---- BEACH (4) ----
    // ==========================================
    {
        title: 'Beachfront Paradise Villa – Goa',
        description: 'Wake up to the sound of waves in this luxury beachfront villa in North Goa. Nestled right on Calangute Beach, the villa features a private plunge pool, lush tropical gardens, and panoramic Arabian Sea views. Perfect for families and couples seeking a coastal escape with direct private beach access.',
        price: 14500,
        location: {
            address: '12 Calangute Beach Road',
            city: 'Goa',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [73.7522, 15.5440] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_1a' },
            { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_1b' },
        ],
        category: 'Beach',
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'AC', 'Balcony'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        title: 'Cliff Beach House – Varkala',
        description: 'Perched on the dramatic red laterite cliffs of Varkala, this breezy beach house offers uninterrupted views of the Arabian Sea. Watch sunsets turn the sky orange from your private terrace, take the cliff-side path down to the beach, or relax with fresh coconut water. Walking distance to yoga studios and coastal cafes.',
        price: 8500,
        location: {
            address: 'North Cliff, Varkala Beach',
            city: 'Varkala',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.7160, 8.7379] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_2a' },
            { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_2b' },
        ],
        category: 'Beach',
        amenities: ['WiFi', 'Balcony', 'Kitchen', 'AC'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Secluded White Sand Villa – Havelock',
        description: 'Step directly from your private sun deck onto the powdery sands of Radhanagar Beach. Surrounded by coconut palms and azure waters, this eco-luxury bungalow offers open-air rain showers, hammock verandas, and guided snorkelling right off the reef.',
        price: 18500,
        location: {
            address: 'Beach No. 7, Havelock Island',
            city: 'Havelock',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [92.9772, 11.9845] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_3a' },
            { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_3b' },
        ],
        category: 'Beach',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Balcony', 'Breakfast included'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Om Beach Coastal Cottage – Gokarna',
        description: 'Tucked into the lush green hillside overlooking Om Beach, this rustic stone cottage blends tranquility with natural coastal beauty. Enjoy panoramic sea views, evening dolphin sightings, and peaceful walks along the pristine cliffs of Gokarna.',
        price: 6800,
        location: {
            address: 'Om Beach Cliff Road',
            city: 'Gokarna',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [74.3168, 14.5186] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_4a' },
            { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_beach_4b' },
        ],
        category: 'Beach',
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Pet friendly'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ==========================================
    // ---- MOUNTAINS (4) ----
    // ==========================================
    {
        title: 'Snow Peak Chalet – Shimla',
        description: 'A classic Himalayan chalet tucked into the forested hillsides above Shimla. Wake up to crisp mountain air and panoramic views of snow-dusted peaks. Features a stone fireplace, handcrafted deodar wood furniture, and a sunlit veranda perfect for morning tea.',
        price: 10500,
        location: {
            address: 'Chota Shimla, Near Jakhu Temple',
            city: 'Shimla',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.1734, 31.1048] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_1a' },
            { url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_1b' },
        ],
        category: 'Mountains',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Balcony'],
        maxGuests: 5,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Tea Garden Bungalow – Darjeeling',
        description: 'A charming British-era planter bungalow nestled inside a working organic tea estate. Watch sunrise over Mount Kanchenjunga from your manicured lawn, join morning tea pluckers, and enjoy fresh first-flush Darjeeling brew right at source.',
        price: 9200,
        location: {
            address: 'Happy Valley Tea Estate',
            city: 'Darjeeling',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [88.2636, 27.0410] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_2a' },
            { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_2b' },
        ],
        category: 'Mountains',
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Fireplace', 'Breakfast included'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Solang Valley Alpine Lodge – Manali',
        description: 'Situated at 8,500 feet with floor-to-ceiling glass walls showcasing the Pir Panjal range. Features heated timber floors, an indoor firepit, and an outdoor cedarwood tub looking out over glacier valleys.',
        price: 13500,
        location: {
            address: 'Solang Valley Village',
            city: 'Manali',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.1583, 32.3167] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_3a' },
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_3b' },
        ],
        category: 'Mountains',
        amenities: ['WiFi', 'Fireplace', 'Hot tub', 'Parking', 'Kitchen'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        title: 'Meadow Ski Cottage – Gulmarg',
        description: 'Step right out onto powdery slopes from this ski-in, ski-out timber lodge in Kashmir. Heated stone bathrooms, cedar aroma, Kashmiri rugs, and piping hot Kahwa by the fireplace make this the pinnacle of mountain coziness.',
        price: 16000,
        location: {
            address: 'Upper Gondola Road',
            city: 'Gulmarg',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [74.3805, 34.0484] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_4a' },
            { url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_mtn_4b' },
        ],
        category: 'Mountains',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Breakfast included', 'Heating'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },

    // ==========================================
    // ---- CITY (4) ----
    // ==========================================
    {
        title: 'Sky-High Luxury Apartment – Mumbai',
        description: 'Experience Mumbai from this ultra-modern 32nd-floor designer apartment in Bandra Kurla Complex. Floor-to-ceiling glass gives unmatched skyline views. Equipped with Italian marble bathrooms, home automation, and proximity to fine dining.',
        price: 18500,
        location: {
            address: 'Bandra Kurla Complex, BKC',
            city: 'Mumbai',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [72.8656, 19.0622] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_1a' },
            { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_1b' },
        ],
        category: 'City',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Gym', 'TV', 'Washer', 'Pool'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Heritage Loft – Old Delhi',
        description: 'A restored loft apartment inside a 19th-century merchant haveli in historic Chandni Chowk. Exposed brick arches, high timber ceilings, and antique bronze lamps blend history with contemporary boutique luxury.',
        price: 7800,
        location: {
            address: 'Chandni Chowk, Old Delhi',
            city: 'Delhi',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.2310, 28.6562] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_2a' },
            { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_2b' },
        ],
        category: 'City',
        amenities: ['WiFi', 'AC', 'Kitchen', 'TV', 'Workspace'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Garden Penthouse – Bengaluru',
        description: 'Tucked away in the tree-lined avenues of Indiranagar, this penthouse boasts a private rooftop terrace garden, sun-drenched reading room, and high-speed fiber internet. Steps away from the best microbreweries and indie cafes.',
        price: 11000,
        location: {
            address: '100ft Road, Indiranagar',
            city: 'Bengaluru',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.6412, 12.9716] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_3a' },
            { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_3b' },
        ],
        category: 'City',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Balcony', 'Workspace', 'Parking'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Boutique Residence – Hyderabad',
        description: 'An elegant contemporary villa located in upscale Jubilee Hills. Features private lawn dining, minimalist architecture, state-of-the-art chef kitchen, and curated modern art throughout the house.',
        price: 14000,
        location: {
            address: 'Road No. 36, Jubilee Hills',
            city: 'Hyderabad',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [78.4069, 17.4325] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_4a' },
            { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_city_4b' },
        ],
        category: 'City',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Pool', 'Parking', 'Gym'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },

    // ==========================================
    // ---- COUNTRYSIDE (4) ----
    // ==========================================
    {
        title: 'Lakeside Cottage – Nainital',
        description: 'A quaint stone cottage right on the quiet banks of Naini Lake in the hills of Uttarakhand. Row a wooden boat at sunrise, explore cedar walking trails, and enjoy the evening mist from your private stone porch.',
        price: 7500,
        location: {
            address: 'Lake Side Road, Mallital',
            city: 'Nainital',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [79.4616, 29.3919] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_1a' },
            { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_1b' },
        ],
        category: 'Countryside',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Balcony', 'Fireplace'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Mustard Fields Homestay – Amritsar',
        description: 'A warm family-run farmstay set amidst golden mustard fields in rural Punjab. Wake up to birdsong, savor authentic farm-fresh makki di roti with sarson da saag, and experience village tranquility 25 minutes from the Golden Temple.',
        price: 5200,
        location: {
            address: 'Village Chheharta, Amritsar Rural',
            city: 'Amritsar',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [74.8728, 31.6340] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_2a' },
            { url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_2b' },
        ],
        category: 'Countryside',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Pet friendly', 'Breakfast included'],
        maxGuests: 5,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Misty Valley Estate – Munnar',
        description: 'Perched in the emerald rolling tea gardens of Idukki district. Breathe in mountain air scented with cardamom and eucalyptus, listen to cascading streams, and disconnect in this charming stone-clad retreat.',
        price: 6900,
        location: {
            address: 'Chithirapuram Post, Munnar',
            city: 'Munnar',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.0595, 10.0889] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_3a' },
            { url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_3b' },
        ],
        category: 'Countryside',
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Breakfast included'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Spice Plantation Farmhouse – Wayanad',
        description: 'Immerse yourself in a 20-acre organic pepper, cinnamon, and coffee plantation. Features traditional Kerala tiled roofs, wooden swings on the verandah, and evening bonfires under clear starry skies.',
        price: 6100,
        location: {
            address: 'Meppadi Hills, Wayanad',
            city: 'Wayanad',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.1320, 11.6854] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_4a' },
            { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_country_4b' },
        ],
        category: 'Countryside',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Pet friendly'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },

    // ==========================================
    // ---- DESERT (4) ----
    // ==========================================
    {
        title: 'Royal Dunes Glamping – Jaisalmer',
        description: 'Sleep under a canopy of stars in luxury Swiss tents nestled directly in the Thar Desert dunes. Includes private ensuite bathrooms, evening Rajasthani folk music by the bonfire, and sunset camel safaris.',
        price: 12500,
        location: {
            address: 'Sam Sand Dunes, Thar Desert',
            city: 'Jaisalmer',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [70.9083, 26.9157] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_1a' },
            { url: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_1b' },
        ],
        category: 'Desert',
        amenities: ['AC', 'Balcony', 'Breakfast included', 'Parking'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Maharaja Desert Suite – Bikaner',
        description: 'An opulent desert tent camp near the ancient Junagarh Fort. Hand-embroidered tapestries, brass lanterns, private dining under desert stars, and curated culinary experiences with royal desert chefs.',
        price: 11000,
        location: {
            address: 'Camel Safari Trail, Thar Dunes',
            city: 'Bikaner',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [73.3119, 28.0229] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_2a' },
            { url: 'https://images.unsplash.com/photo-1484821582734-6692f4ec3c9c?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_2b' },
        ],
        category: 'Desert',
        amenities: ['AC', 'Balcony', 'Breakfast included'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Desert Oasis Villa – Pushkar',
        description: 'Surrounded by the arid Aravalli ranges and rolling sand hills, this boutique desert oasis features a sunlit courtyard swimming pool, organic farm dining, and easy access to the holy Pushkar lake.',
        price: 9500,
        location: {
            address: 'Desert Camp Road, Motisar',
            city: 'Pushkar',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [74.5554, 26.4897] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_3a' },
            { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_3b' },
        ],
        category: 'Desert',
        amenities: ['WiFi', 'Pool', 'AC', 'Kitchen', 'Parking'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Golden Sand Camp – Osian',
        description: 'Experience pure silence in the historic desert outpost of Osian. Private luxury tents with handwoven kilims, open-air stargazing showers, and sunrise desert treks with knowledgeable desert guides.',
        price: 8800,
        location: {
            address: 'Osian Dunes Road',
            city: 'Jodhpur',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [72.9982, 26.7271] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_4a' },
            { url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_desert_4b' },
        ],
        category: 'Desert',
        amenities: ['AC', 'Parking', 'Breakfast included'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ==========================================
    // ---- ARCTIC (4) ----
    // ==========================================
    {
        title: 'Glass Igloo Suite – Rovaniemi',
        description: 'Watch the Northern Lights dance across the sky from the heated comfort of your motorized glass igloo bed in Finnish Lapland. Includes a private en-suite sauna, aurora alert service, and reindeer sleigh rides.',
        price: 36000,
        location: {
            address: 'Arctic Lake Resort, Rovaniemi',
            city: 'Rovaniemi',
            country: 'Finland',
            coordinates: { type: 'Point', coordinates: [25.7482, 66.5039] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_1a' },
            { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_1b' },
        ],
        category: 'Arctic',
        amenities: ['WiFi', 'Fireplace', 'TV', 'Hot tub', 'Heating'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Aurora Borealis Fjord Cabin – Tromsø',
        description: 'An authentic cedarwood timber cabin directly on the shores of the Norwegian fjords. Floor-to-ceiling north-facing panoramic windows guarantee front-row seats to the glowing green aurora displays.',
        price: 31000,
        location: {
            address: 'Kvaløya Island Coast',
            city: 'Tromsø',
            country: 'Norway',
            coordinates: { type: 'Point', coordinates: [18.9553, 69.6496] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_2a' },
            { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_2b' },
        ],
        category: 'Arctic',
        amenities: ['WiFi', 'Fireplace', 'Hot tub', 'Parking', 'Kitchen'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Lofoten Fisherman Rorbu – Reine',
        description: 'Historical red rorbu cabin standing on wooden stilts over deep Arctic waters surrounded by sheer granite peaks. Cozy wood stove, sauna with fjord plunges, and untouched polar serenity.',
        price: 27500,
        location: {
            address: 'Reine Harbour, Lofoten',
            city: 'Reine',
            country: 'Norway',
            coordinates: { type: 'Point', coordinates: [13.0889, 67.9333] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_3a' },
            { url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_3b' },
        ],
        category: 'Arctic',
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Heating', 'Parking'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Snowy Wilderness Lodge – Kiruna',
        description: 'Set deep in Swedish Lapland pine forests blanketed in fresh powder. Features dogsledding tours from your front porch, traditional wood-heated sauna, and undisturbed Aurora viewing.',
        price: 24000,
        location: {
            address: 'Jukkasjärvi Forest Trail',
            city: 'Kiruna',
            country: 'Sweden',
            coordinates: { type: 'Point', coordinates: [20.2253, 67.8558] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_4a' },
            { url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_arctic_4b' },
        ],
        category: 'Arctic',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Breakfast included'],
        maxGuests: 3,
        bedrooms: 2,
        bathrooms: 1,
    },

    // ==========================================
    // ---- LUXURY (4) ----
    // ==========================================
    {
        title: 'Heritage Courtyard Haveli – Jaipur',
        description: 'Step into royal Rajputana splendour in this impeccably restored 18th-century haveli in Jaipur. Hand-carved sandstone jharokhas, marble fountains in the central courtyard, brass antique accents, and royal rooftop dining overlooking the Pink City.',
        price: 21500,
        location: {
            address: 'Chandpole Bazaar, Old City',
            city: 'Jaipur',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [75.8235, 26.9124] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_1a' },
            { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_1b' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'AC', 'Pool', 'Balcony', 'Kitchen', 'Breakfast included'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        title: 'Private Infinity Pool Villa – Udaipur',
        description: 'An extraordinary lakeside estate boasting an infinity pool that seems to spill into Lake Pichola. Spectacular sunset views of the City Palace and Jag Mandir, private butler service, and white marble terraces.',
        price: 28000,
        location: {
            address: 'Lake Pichola Waterfront, Hanuman Ghat',
            city: 'Udaipur',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [73.6833, 24.5764] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_2a' },
            { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_2b' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'Pool', 'AC', 'Kitchen', 'Balcony', 'Hot tub'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Backwater Royal Sanctuary – Kumarakom',
        description: 'Sprawled along Vembanad Lake, this royal retreat features private lotus pond villas, traditional Ayurvedic treatments, personal chef consultations, and private sunset motorboat cruises.',
        price: 24500,
        location: {
            address: 'Vembanad Lake Shore, Kumarakom',
            city: 'Kumarakom',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.4312, 9.6175] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_3a' },
            { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_3b' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'Pool', 'AC', 'Kitchen', 'Breakfast included', 'Spa'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Mehrangarh View Palace Stay – Jodhpur',
        description: 'Perched high in the Blue City with unhindered vistas of Mehrangarh Fort. Hand-painted fresco ceilings, private rooftop plunge pool, antique four-poster beds, and starlight candlelit dining.',
        price: 19500,
        location: {
            address: 'Makrana Mohalla, Blue City',
            city: 'Jodhpur',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [73.0243, 26.2918] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_4a' },
            { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_lux_4b' },
        ],
        category: 'Luxury',
        amenities: ['WiFi', 'AC', 'Pool', 'Balcony', 'Breakfast included'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },

    // ==========================================
    // ---- CABIN (4) ----
    // ==========================================
    {
        title: 'Cozy Pine Cabin – Manali',
        description: 'A genuine deodar timber cabin set among whispering pine woods with panoramic snow peak vistas. Cozy fireplace evenings, cedarwood scent, and peaceful proximity to old Manali cafes and trails.',
        price: 6800,
        location: {
            address: 'Old Manali Pine Forest',
            city: 'Manali',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.1892, 32.2396] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_1a' },
            { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_1b' },
        ],
        category: 'Cabin',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Balcony', 'Parking'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Log Cabin by Parvati River – Kasol',
        description: 'Hand-crafted from local river stones and solid pine logs on the rushing banks of the Parvati River. Wake up to glacial blue waters, pine breezes, and warm fireside gatherings under towering peaks.',
        price: 5900,
        location: {
            address: 'Parvati Valley River Trail',
            city: 'Kasol',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.3162, 32.0094] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_2a' },
            { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_2b' },
        ],
        category: 'Cabin',
        amenities: ['Kitchen', 'Fireplace', 'Pet friendly', 'Balcony'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Tirthan Riverside Stone Chalet',
        description: 'Bordering the Great Himalayan National Park, this serene riverside cabin offers private trout fishing, apple orchard walks, and stargazing from a wooden balcony above rushing stream water.',
        price: 7200,
        location: {
            address: 'Gushaini Riverbank, Tirthan Valley',
            city: 'Tirthan',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.4121, 31.6378] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_3a' },
            { url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_3b' },
        ],
        category: 'Cabin',
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Breakfast included'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        title: 'Jibhi Attic Wood Cottage',
        description: 'A fairytale-like wooden triangular A-frame cabin tucked in a cedar grove in Jibhi. Skylights above the bed let you sleep under starry skies, with hot water, wood stove, and a private stream nearby.',
        price: 6400,
        location: {
            address: 'Jibhi Waterfall Lane',
            city: 'Jibhi',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.3820, 31.6212] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_4a' },
            { url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_cabin_4b' },
        ],
        category: 'Cabin',
        amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Balcony'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ==========================================
    // ---- TREEHOUSE (4) ----
    // ==========================================
    {
        title: 'Canopy Bamboo Treehouse – Coorg',
        description: 'Elevated 35 feet up into the canopy of a private coffee and spice plantation in Coorg. Wake up surrounded by songbirds and morning mist, sipping freshly roasted Arabica coffee on your wooden tree deck.',
        price: 9400,
        location: {
            address: 'Madikeri Coffee Estate',
            city: 'Coorg',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [75.7382, 12.3375] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1488441770602-aed21fc49bd5?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_1a' },
            { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_1b' },
        ],
        category: 'Treehouse',
        amenities: ['WiFi', 'Balcony', 'Breakfast included', 'Pet friendly'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Rainforest Giant Treehouse – Wayanad',
        description: 'Engineered safely around a giant 150-year-old jungle tree in a private Kerala rainforest sanctuary. Open wooden slats let natural breezes through, with an observation deck for spotting hornbills and wildlife.',
        price: 11500,
        location: {
            address: 'Tholpetty Rainforest Reserve',
            city: 'Wayanad',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.1320, 11.6854] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_2a' },
            { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_2b' },
        ],
        category: 'Treehouse',
        amenities: ['Balcony', 'Breakfast included', 'Kitchen', 'Parking'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Misty Cloud Treehouse – Munnar',
        description: 'Suspended above emerald tea slopes, this luxury treehouse offers panoramic mountain cloudscapes. Enjoy complete quiet, aromatic tea tasting sessions, and private sunset viewpoints.',
        price: 8900,
        location: {
            address: 'Devikulam Ridge Road',
            city: 'Munnar',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [77.0595, 10.0889] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_3a' },
            { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_3b' },
        ],
        category: 'Treehouse',
        amenities: ['WiFi', 'Balcony', 'Breakfast included'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Athirappilly Waterfall Treehouse',
        description: 'Nestled in dense Western Ghats canopy with distant views and echoes of the mighty Athirappilly waterfalls. Handcrafted wooden architecture, solar amenities, and pristine jungle immersion.',
        price: 10200,
        location: {
            address: 'Chalakudy River Road',
            city: 'Athirappilly',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.5167, 10.2858] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_4a' },
            { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_tree_4b' },
        ],
        category: 'Treehouse',
        amenities: ['WiFi', 'Balcony', 'Breakfast included', 'Kitchen'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },

    // ==========================================
    // ---- ISLAND (4) ----
    // ==========================================
    {
        title: 'Luxury Backwater Houseboat – Alleppey',
        description: 'Drift past paddy fields, coconut groves, and silent lagoons on an authentic Kerala kettuvallam wooden houseboat. Staffed with a private chef serving traditional Karimeen fish and Kerala delicacies, AC master suite, and an open front observation deck.',
        price: 15500,
        location: {
            address: 'Vembanad Lake Jetty, Finishing Point',
            city: 'Alleppey',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.3388, 9.4981] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_1a' },
            { url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_1b' },
        ],
        category: 'Island',
        amenities: ['AC', 'Kitchen', 'TV', 'Breakfast included', 'Balcony'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Coral Beach Bungalow – Havelock Island',
        description: 'A secluded private beachfront villa on the white coral sands of Havelock Island. Step right into turquoise waters, kayak with sea turtles, and relax on your private sunset hammock deck under swaying palms.',
        price: 18500,
        location: {
            address: 'Govind Nagar Beach, Havelock',
            city: 'Port Blair',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [92.9376, 11.9810] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_2a' },
            { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_2b' },
        ],
        category: 'Island',
        amenities: ['WiFi', 'AC', 'Balcony', 'Kitchen', 'Breakfast included'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        title: 'Sunset Coral Villa – Neil Island',
        description: 'Located minutes from Bharatpur and Laxmanpur beaches on quiet Neil Island. Wooden sun loungers, fresh tropical fruit breakfasts, and private boat trips to natural rock formations.',
        price: 14000,
        location: {
            address: 'Laxmanpur Beach Road',
            city: 'Neil Island',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [93.0478, 11.8322] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_3a' },
            { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_3b' },
        ],
        category: 'Island',
        amenities: ['WiFi', 'AC', 'Balcony', 'Breakfast included'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        title: 'Munroe Island Backwater Cottage',
        description: 'Situated on the confluence of Ashtamudi Lake and the Kallada River on tranquil Munroe Island. Early morning canoe rides through narrow mangrove canals, authentic home-cooked Kerala seafood, and hammock verandas.',
        price: 9200,
        location: {
            address: 'Munroe Island Canal Shore',
            city: 'Kollam',
            country: 'India',
            coordinates: { type: 'Point', coordinates: [76.6111, 8.9950] },
        },
        images: [
            { url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_4a' },
            { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80', publicId: 'demo_island_4b' },
        ],
        category: 'Island',
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Pet friendly'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
    },
];

const DEMO_REVIEWS = [
    { rating: 5, comment: 'Absolutely breathtaking! The location was even more beautiful than the photos. We will definitely come back.' },
    { rating: 5, comment: 'Perfect stay. The host was incredibly welcoming and the amenities were top notch. Highly recommend!' },
    { rating: 4, comment: 'Great property with stunning views. Serene surroundings and a wonderful experience overall.' },
    { rating: 5, comment: 'One of the best travel experiences of our lives. The property is magical and spotless.' },
    { rating: 4, comment: 'Very comfortable and well-equipped. The location is unbeatable. Loved the sunrise views.' },
    { rating: 5, comment: 'Hidden gem! Felt like our own private paradise. Every detail was thoughtfully curated.' },
    { rating: 5, comment: 'Exceptional hospitality. Delicious local food and the most peaceful atmosphere imaginable.' },
    { rating: 4, comment: 'Great value for money. Exactly as described, spotless interiors, and swift communication.' },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!\n');

        // Clean out demo listings AND any stray test listings (like 'america' or Visnagar)
        const deleteFilter = {
            $or: [
                { isFeatured: true },
                { title: { $regex: '^america$', $options: 'i' } },
                { 'location.city': 'Visnagar' }
            ]
        };
        const deleted = await Listing.deleteMany(deleteFilter);
        console.log(`Cleared ${deleted.deletedCount} old demo/test listings\n`);

        // Create or find demo host
        let demoHost = await User.findOne({ email: 'demo@wanderlust.com' });
        if (!demoHost) {
            demoHost = await User.create({
                name: 'Wanderlust Curations',
                email: 'demo@wanderlust.com',
                password: 'demo1234',
                bio: 'Official Wanderlust curator. We handpick the most unique stays across India and the world.',
            });
            console.log('Created demo host:', demoHost.email);
        } else {
            console.log('Using existing demo host:', demoHost.email);
        }

        // Reviewer user for sample reviews
        let reviewer = await User.findOne({ email: 'traveller@wanderlust.com' });
        if (!reviewer) {
            reviewer = await User.create({
                name: 'Happy Traveller',
                email: 'traveller@wanderlust.com',
                password: 'travel1234',
            });
        }

        // Insert all 40 listings
        console.log('\nSeeding 40 listings (4 per category)...');
        const created = [];
        for (const data of DEMO_LISTINGS) {
            const listing = await Listing.create({
                ...data,
                host: demoHost._id,
                isFeatured: true,
            });
            created.push(listing);
            console.log(`  + ${listing.title} [${listing.category}] – ₹${listing.price.toLocaleString('en-IN')}`);
        }

        // Add reviews to the listings
        console.log('\nAdding sample reviews...');
        for (let i = 0; i < created.length; i++) {
            // Give reviews to 30 of the 40 listings
            if (i < 30) {
                try {
                    const rev = DEMO_REVIEWS[i % DEMO_REVIEWS.length];
                    await Review.create({
                        listing: created[i]._id,
                        author: reviewer._id,
                        rating: rev.rating,
                        comment: rev.comment,
                    });
                    // Update average rating on listing document
                    created[i].averageRating = rev.rating;
                    created[i].reviewCount = (i % 3) + 1; // 1 to 3 reviews
                    await created[i].save();
                } catch (e) {
                    // skip silently
                }
            }
        }

        console.log('\nDone!');
        console.log(`  ${created.length} listings created across all 10 categories.`);
        console.log(`  Host login:      demo@wanderlust.com / demo1234`);
        console.log(`  Traveller login: traveller@wanderlust.com / travel1234`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
