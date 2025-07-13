const mongoose = require('mongoose');
const InfraCategory = require('../models/InfraCategory');
require('dotenv').config();

const categories = [
  {
    name: "Basic Civil Infrastructure",
    subcategories: [
      "Boundary Wall",
      "Compound Wall",
      "Entrance Gate",
      "Pathway",
      "Drainage System",
      "Water Storage Tank",
      "Water Pipeline",
      "Toilet Block",
      "Urinal",
      "Hand Wash Basin",
      "Drinking Water Facility",
      "Rain Water Harvesting",
      "Solar Water Heater",
      "Water Purifier",
      "Water Cooler",
      "Water Filter",
      "Water Pump",
      "Water Tank Stand",
      "Water Pipeline Repair",
      "Toilet Seat",
      "Toilet Door",
      "Toilet Lock"
    ]
  },
  {
    name: "Basic Electrical Infrastructure",
    subcategories: [
      "Electrical Wiring",
      "Electrical Panel",
      "Electrical Switch",
      "Electrical Socket",
      "Electrical Fuse",
      "Electrical MCB",
      "Electrical RCCB",
      "Electrical Earthing"
    ]
  },
  {
    name: "Classroom Needs",
    subcategories: [
      "Blackboard",
      "Whiteboard",
      "Chalk",
      "Duster",
      "Marker",
      "Projector Screen",
      "Projector Stand",
      "Classroom Fan",
      "Classroom Light",
      "Classroom Chair"
    ]
  },
  {
    name: "Digital Infrastructure",
    subcategories: [
      "Computer",
      "Laptop",
      "Printer",
      "Scanner",
      "Projector",
      "Speaker",
      "Microphone",
      "Camera",
      "Internet Connection",
      "WiFi Router",
      "UPS",
      "Stabilizer"
    ]
  },
  {
    name: "Equipment for Co‑Curricular Activities & Sports",
    subcategories: [
      "Cricket Bat",
      "Cricket Ball",
      "Football",
      "Volleyball",
      "Basketball",
      "Badminton Racket",
      "Badminton Net",
      "Table Tennis Table",
      "Table Tennis Racket",
      "Chess Board",
      "Carrom Board"
    ]
  },
  {
    name: "Health and Safety Aids",
    subcategories: [
      "First Aid Kit",
      "Fire Extinguisher",
      "Smoke Detector",
      "Emergency Light",
      "Safety Sign",
      "Safety Helmet",
      "Safety Gloves",
      "Safety Shoes",
      "Safety Goggles",
      "Safety Belt"
    ]
  },
  {
    name: "Item for Residential Schools",
    subcategories: [
      "Bed",
      "Mattress",
      "Pillow"
    ]
  },
  {
    name: "Maintenance & Repairs",
    subcategories: [
      "Paint",
      "Brush",
      "Cement",
      "Sand",
      "Bricks",
      "Steel",
      "Tools",
      "Ladder"
    ]
  },
  {
    name: "Office Needs",
    subcategories: [
      "Office Chair",
      "Office Table",
      "Filing Cabinet",
      "Notice Board",
      "Clock",
      "Calendar",
      "Pen Stand",
      "Paper Tray",
      "Stapler"
    ]
  },
  {
    name: "Teaching Learning Material",
    subcategories: [
      "Text Books",
      "Note Books",
      "Stationery Items",
      "Educational Charts"
    ]
  },
  {
    name: "Tool Kits and Miscellaneous Equipment",
    subcategories: [
      "Tool Kit",
      "Measuring Tape",
      "Screw Driver",
      "Hammer",
      "Pliers",
      "Wrench",
      "Drill Machine"
    ]
  }
];

const seedInfraCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vidyasetu');
    console.log('Connected to MongoDB');

    // Clear existing categories
    await InfraCategory.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const result = await InfraCategory.insertMany(categories);
    console.log(`Successfully seeded ${result.length} infrastructure categories`);

    // Display the seeded categories
    result.forEach(category => {
      console.log(`${category.name}: ${category.subcategories.length} subcategories`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding infrastructure categories:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInfraCategories();
}

module.exports = seedInfraCategories; 