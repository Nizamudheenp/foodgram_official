const SpotDB = require('../models/SpotModel');
const ReviewDB = require('../models/ReviewModel');
const UserDB = require('../models/UserModel')
const cloudinary = require('cloudinary').v2;

exports.submitspot = async (req, res) => {
  const { name, description, district, location } = req.body;
  const userId = req.user.id;
  const images = req.files || [];

  if (images.length === 0) {
    return res.status(400).json({ message: 'At least one image is required.' });
  }

  try {
    const uploadResults = await Promise.all(
      images.map(file => cloudinary.uploader.upload(file.path))
    );

    const imageUrls = uploadResults.map(upload => upload.secure_url);

    const newSpot = new SpotDB({
      name,
      description,
      district,
      location,
      user: userId,
      images: imageUrls,
      is_verified: false
    });

    await newSpot.save();

    res.status(201).json({ message: "Food spot submitted for review!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addReview = async (req, res) => {
  const { spot_id, rating, comment } = req.body;
  const userId = req.user.id;
  try {
    const existing = await ReviewDB.findOne({ user: userId, spot: spot_id });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this spot." });
    }

    const review = new ReviewDB({ user: userId, spot: spot_id, rating, comment });
    await review.save();

    res.status(201).json({ message: "Review added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add review" });
  }
};

exports.getReviewsBySpot = async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const reviews = await ReviewDB.find({ spot: spotId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get reviews" });
  }
};

exports.getRatingsSummary = async (req, res) => {
  try {
    const summary = await ReviewDB.aggregate([
      {
        $group: {
          _id: "$spot",
          average_rating: { $avg: "$rating" },
          total_reviews: { $sum: 1 }
        }
      },
      {
        $project: {
          spot_id: "$_id",
          average_rating: { $round: ["$average_rating", 1] },
          total_reviews: 1,
          _id: 0
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get ratings summary" });
  }
};

exports.getTopRatedSpots = async (req, res) => {
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

    res.json(topSpots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top rated spots" });
  }
};


exports.getSpotsbydistrict = async (req, res) => {
  const { district } = req.query;

  const matchQuery = { is_verified: true };
  if (district) matchQuery.district = district;

  try {
    const ratedSpots = await SpotDB.aggregate([
      { $match: matchQuery },
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
      { $sort: { average_rating: -1 } }
    ]);

    res.json(ratedSpots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spots by district" });
  }
};


exports.searchspot = async (req, res) => {
  const { query: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  // Basic sanitization for regex
  const sanitizedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  try {
    const ratedSpots = await SpotDB.aggregate([
      {
        $match: {
          name: { $regex: sanitizedQuery, $options: "i" },
          is_verified: true
        }
      },
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
      { $sort: { average_rating: -1 } }
    ]);

    res.json(ratedSpots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search spots" });
  }
};



exports.getProfile = async (req, res) => {
  const userId = req.user.id

  try {
    const user = await UserDB.findById(userId).select("username email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    await UserDB.findByIdAndDelete(userId);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

