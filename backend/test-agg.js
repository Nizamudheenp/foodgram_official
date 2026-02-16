const mongoose = require('mongoose');
const SpotDB = require('./models/SpotModel');
const ReviewDB = require('./models/ReviewModel');
require('dotenv').config();

async function test() {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected');

    try {
        const topSpots = await SpotDB.aggregate([
            { $match: { is_verified: true } },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "spot",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    average_rating: { $ifNull: [{ $round: [{ $avg: "$reviews.rating" }, 1] }, 0] },
                    total_reviews: { $size: "$reviews" }
                }
            },
            { $project: { reviews: 0 } },
            { $sort: { average_rating: -1 } },
            { $limit: 10 }
        ]);
        console.log('Result:', JSON.stringify(topSpots, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

test();
