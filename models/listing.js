const mongoose = require("mongoose");
const { type } = require("node:os");
const { title } = require("node:process");
const { describe } = require("node:test");
const { Review, reviewSchema } = require("./reviews");
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1568879844413-7827cbf81261?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) => (v === "" ? "" : v),
    },
    filename: {
      type: String,
      default: "Listing name",
    },
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  console.log(listing);
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
