const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const { Review } = require("../models/reviews.js");

const reviewValidation = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body || {});
  if (error) {
    console.log(error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

router.post(
  "/",
  reviewValidation,
  wrapAsync(async (req, res) => {
    let result = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    result.reviews.push(newReview);

    await result.save();
    await newReview.save();

    console.log("review added in to the DB");
    res.redirect(`/listings/${req.params.id}`);
  }),
);

// Delete Review route

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
