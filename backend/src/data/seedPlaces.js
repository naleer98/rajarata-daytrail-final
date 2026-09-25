import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Place from '../models/Place.js';
import User from '../models/User.js';
import { calculateHaversineDistance } from '../utils/distance.js';

const HOME_LAT = parseFloat(process.env.HOME_LAT || '8.3114');
const HOME_LNG = parseFloat(process.env.HOME_LNG || '80.4037');

const placesData = [
  {
    name: 'Jaya Sri Maha Bodhi',
    description:
      'A sacred fig tree in the Mahamewna Gardens, grown from a cutting brought from Bodh Gaya, India. It is the oldest known human-planted tree in the world with a documented planting date.',
    category: 'Religious',
    address: 'Mahamewna Gardens, Sacred City, Anuradhapura',
    coordinates: { lat: 8.3448, lng: 80.3965 },
    openingTime: '06:00',
    closingTime: '21:00',
    visitDuration: 75,
    entryFee: 'Free for locals / LKR 200 or foreign ticket for tourists',
    contactNumber: '+94 25 222 2288',
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Visit early in the morning or around sunset to avoid hot stones. Bring flowers or oil lamps for offering.',
    dressCode:
      'Compulsory white or light-coloured modest clothing covering shoulders and knees. Footwear and hats must be removed.',
    facilities: ['Shoe Counter', 'Rest Area', 'Drinking Water', 'Parking Area'],
    bestVisitTime: '06:30 - 08:30 or 17:30 - 19:30',
  },
  {
    name: 'Ruwanwelisaya',
    description:
      'A majestic stupa built by King Dutugemunu in 140 B.C. One of the world’s tallest ancient monuments, renowned for its dazzling white dome and elephant-carved perimeter wall.',
    category: 'Religious',
    address: 'Sacred City, Anuradhapura',
    coordinates: { lat: 8.3501, lng: 80.3963 },
    openingTime: '05:30',
    closingTime: '21:30',
    visitDuration: 60,
    entryFee: 'Free for locals / Included in Cultural Triangle ticket',
    contactNumber: '+94 25 222 2282',
    images: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'The floor tiles get very hot by midday. Cotton socks are permitted and recommended to protect feet.',
    dressCode:
      'Modest white clothing covering shoulders and knees. Hats and shoes must be removed at the outer gateway.',
    facilities: ['Restrooms', 'Information Counter', 'Shoe Keeping Area', 'Security'],
    bestVisitTime: '17:00 - 19:30 during evening chanting ceremony',
  },
  {
    name: 'Isurumuniya Temple',
    description:
      'A historic 3rd-century BC rock temple situated near Tissa Wewa, famous for the classic "Isurumuniya Lovers" stone carving, rock cliff carvings, and tranquil lotus ponds.',
    category: 'Heritage',
    address: 'Isurumuniya Rock Temple, Anuradhapura',
    coordinates: { lat: 8.3333, lng: 80.3906 },
    openingTime: '07:00',
    closingTime: '18:00',
    visitDuration: 45,
    entryFee: 'LKR 100 for locals / LKR 500 for foreign visitors',
    contactNumber: '+94 25 222 2673',
    images: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Climb the rock summit for a panoramic view over Tissa Wewa reservoir. Check out the on-site archaeology room.',
    dressCode:
      'Modest attire covering knees and shoulders. Remove footwear before climbing sacred precincts.',
    facilities: ['Archaeological Museum Room', 'Ticket Counter', 'Restrooms'],
    bestVisitTime: '08:00 - 10:30',
  },
  {
    name: 'Jetavanaramaya',
    description:
      'An engineering marvel standing at over 120 metres, once the third tallest human-made structure in antiquity. Built with millions of baked clay bricks by King Mahasena.',
    category: 'Heritage',
    address: 'Jetavana Monastery Complex, Anuradhapura',
    coordinates: { lat: 8.3516, lng: 80.4034 },
    openingTime: '07:00',
    closingTime: '18:30',
    visitDuration: 50,
    entryFee: 'Part of Central Cultural Fund ticket for foreigners / Free for locals',
    contactNumber: '+94 25 222 2741',
    images: [
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Notice the fine brick patterns and visit the Jetavana museum nearby to see ancient Roman beads excavated here.',
    dressCode: 'Modest respectful dress. Shoulders and knees covered.',
    facilities: ['Parking', 'Explanatory Signboards', 'Museum Nearby'],
    bestVisitTime: '07:30 - 09:30 or 16:30 - 18:00',
  },
  {
    name: 'Abhayagiri Stupa and Monastic Complex',
    description:
      'A sprawling monastery that once accommodated over 5,000 monks and scholars from around Asia. Features majestic ruins, carved guardstones, and ancient monastic refectories.',
    category: 'Heritage',
    address: 'Abhayagiri Monastery Area, Anuradhapura',
    coordinates: { lat: 8.3712, lng: 80.3957 },
    openingTime: '07:00',
    closingTime: '18:00',
    visitDuration: 60,
    entryFee: 'Free for locals / CCF ticket applies to foreign tourists',
    contactNumber: '+94 25 222 2810',
    images: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Bicycle or tuk-tuk is ideal for getting between different ruins within the expansive Abhayagiri monastic park.',
    dressCode: 'Respectful attire required around the stupa courtyard.',
    facilities: ['Spacious Parking', 'Archaeology Museum', 'Guide Services'],
    bestVisitTime: '08:00 - 11:00',
  },
  {
    name: 'Thuparamaya',
    description:
      'The first historic stupa built in Sri Lanka following the introduction of Buddhism in the 3rd century BC. Houses the sacred collarbone relic of Lord Buddha, framed by unique concentric stone pillars.',
    category: 'Religious',
    address: 'North of Ruwanwelisaya, Sacred City, Anuradhapura',
    coordinates: { lat: 8.3551, lng: 80.3965 },
    openingTime: '06:00',
    closingTime: '20:00',
    visitDuration: 40,
    entryFee: 'Free entry',
    contactNumber: '+94 25 222 2301',
    images: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Very quiet and serene compared to larger stupas. Excellent for quiet contemplation and observing stone pillars (Vatadage).',
    dressCode: 'White clothing strongly recommended. Remove footwear.',
    facilities: ['Footwear stand', 'Benches under trees', 'Security Post'],
    bestVisitTime: '07:00 - 08:30 or 17:00 - 18:30',
  },
  {
    name: 'Kuttam Pokuna (Twin Ponds)',
    description:
      'Remarkable ancient bathing pools constructed for monks of the Abhayagiri fraternity, illustrating sophisticated hydrological engineering, multi-stage water filtration, and graceful stone artistry.',
    category: 'Heritage',
    address: 'Near Abhayagiri Complex, Anuradhapura',
    coordinates: { lat: 8.3719, lng: 80.4045 },
    openingTime: '07:00',
    closingTime: '18:00',
    visitDuration: 30,
    entryFee: 'Cultural Triangle entry ticket applies for foreign guests / Free for locals',
    contactNumber: '+94 25 222 2110',
    images: [
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Observe the underground conduit system and the stone five-headed naga (cobra) carving at the entrance.',
    dressCode: 'Modest casual wear.',
    facilities: ['Paved Pathways', 'Shaded Trees', 'Information Board'],
    bestVisitTime: '09:00 - 11:00 or 15:30 - 17:00',
  },
  {
    name: 'Samadhi Buddha Statue',
    description:
      'A world-renowned 4th-century granite Buddha sculpture carved in the Dhyana Mudra posture of deep meditation. Praised for its calming aura and serene sculptural balance.',
    category: 'Religious',
    address: 'Mahamevnawa Park, Anuradhapura',
    coordinates: { lat: 8.3618, lng: 80.4004 },
    openingTime: '06:00',
    closingTime: '18:30',
    visitDuration: 30,
    entryFee: 'Free',
    contactNumber: '+94 25 222 2115',
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Photography with people posing with their backs to the statue is strictly forbidden by Sri Lankan law. Maintain silence.',
    dressCode:
      'Cover shoulders and knees. Hats and shoes off before entering the sheltered pavilion.',
    facilities: ['Shoe Care Stand', 'Meditation Seating', 'Security Warden'],
    bestVisitTime: '07:00 - 09:00',
  },
  {
    name: 'Tissa Wewa',
    description:
      'An ancient reservoir constructed in the 3rd century BC by King Devanampiya Tissa to irrigate royal gardens and the sacred city. Features picturesque bund walks and lake sunsets.',
    category: 'Nature',
    address: 'Tissa Wewa Bund Road, Anuradhapura',
    coordinates: { lat: 8.3245, lng: 80.3838 },
    openingTime: '05:30',
    closingTime: '19:30',
    visitDuration: 45,
    entryFee: 'Free Public Area',
    contactNumber: 'N/A',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'The bund is scenic for an evening walk or cycling. King coconut stalls line the road.',
    dressCode: 'Casual outdoor clothing.',
    facilities: ['Lakeside Benches', 'Street Food & Refreshments', 'Open Parking'],
    bestVisitTime: '16:30 - 18:30 (Sunset)',
  },
  {
    name: 'Mihintale',
    description:
      'The historic mountain sanctuary venerated as the cradle of Buddhism in Sri Lanka. Reached via 1,840 ancient granite steps, featuring stupas, meditation caves, and panoramic viewpoints.',
    category: 'Religious',
    address: 'Mihintale Rock Sanctuary, Kandy - Jaffna Hwy, Mihintale',
    coordinates: { lat: 8.3512, lng: 80.5098 },
    openingTime: '06:00',
    closingTime: '20:00',
    visitDuration: 120,
    entryFee: 'LKR 500 for foreign visitors / Free for locals',
    contactNumber: '+94 25 226 6222',
    images: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1000&q=80',
    ],
    travelTips:
      'Climb either early morning or late afternoon to escape midday heat on the stairs. Bring water. Monkeys are active.',
    dressCode:
      'Strict modest dress code. White attire preferred. Barefoot on upper rocky levels.',
    facilities: ['Ticket Office', 'Restrooms', 'Souvenir Stalls', 'Drinking Water Points'],
    bestVisitTime: '06:30 - 09:30 or 16:00 - 18:30 (Sunset from Aradhana Gala)',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    if ((await Place.countDocuments()) || (await User.countDocuments())) {
      throw new Error('Seed only runs on an empty database. Use a separate test database.');
    }

    console.log(
      `[Seeding] Calculating distances from Registered Home: (${HOME_LAT}, ${HOME_LNG})...`
    );

    const placesWithDistances = placesData.map((place) => {
      const distance = calculateHaversineDistance(
        HOME_LAT,
        HOME_LNG,
        place.coordinates.lat,
        place.coordinates.lng
      );

      // Generate unique slug for every place
      const slug = place.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        ...place,
        slug,
        distanceFromHome: distance,
        isActive: true,
      };
    });

    const insertedPlaces = await Place.insertMany(placesWithDistances);

    console.log(
      `[Seeding] Successfully inserted ${insertedPlaces.length} places!`
    );

    insertedPlaces.forEach((p) => {
      console.log(
        `  - ${p.name}: ${p.distanceFromHome} km from home [${p.category}]`
      );
    });

    console.log('[Seeding] Creating default users...');

    await User.create({
      name: 'System Administrator',
      email: 'admin@rajarata.lk',
      password: 'AdminPassword123',
      role: 'admin',
    });

    await User.create({
      name: 'Kamal Perera',
      email: 'kamal@gmail.com',
      password: 'TouristPassword123',
      role: 'tourist',
    });

    console.log('[Seeding] Default users created:');
    console.log(
      '  - Admin: email: admin@rajarata.lk | password: AdminPassword123'
    );
    console.log(
      '  - Tourist: email: kamal@gmail.com | password: TouristPassword123'
    );

    console.log('[Seeding] Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeding Error] Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();