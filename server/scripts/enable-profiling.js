// Enable MongoDB Profiling
// Run with: node server/scripts/enable-profiling.js

require("dotenv").config();
const mongoose = require("mongoose");

async function enableProfiling() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    const db = mongoose.connection.db;
    
    // Enable profiling for slow queries (> 200ms)
    await db.command({ profile: 1, slowms: 200 });
    console.log("✅ MongoDB profiling enabled (slowms: 200)");
    
    // Show current profiling level
    const status = await db.command({ profile: -1 });
    console.log("Profiling status:", status);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to enable profiling:", err);
    process.exit(1);
  }
}

enableProfiling();