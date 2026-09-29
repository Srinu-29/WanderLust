const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../Schema.js");

const listingValidation = (req, res, next) => {
  let { error } = listingSchema.validate(req.body || {});

  if (error) {
    console.log(error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find();
    res.render("listings/listings.ejs", { listings });
  }),
);

// create new listings
router.get("/new", (req, res) => {
  res.render("listings/new");
});

//show listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");

    res.render("listings/show.ejs", { listing });
  }),
);

// Post a listing or Create Route
router.post(
  "/",
  listingValidation,
  wrapAsync(async (req, res) => {
    let result = listingSchema.validate(req.body);

    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    let data = new Listing(req.body.listing);
    await data.save();
    res.redirect("/listings");
  }),
);

// Edit a listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    res.render("listings/edit", { listing });
  }),
);

//Update Route
router.patch(
  "/:id",
  listingValidation,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;

    console.log({ ...listing });
    await Listing.findByIdAndUpdate(
      id,
      { ...listing },
      { returnDocument: "after" },
    );
    res.redirect("/listings");
  }),
);

// Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id, { returnDocument: "after" });
    res.redirect("/listings");
  }),
);

module.exports = router;
