
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  building: { type: String, required: true },
  street: { type: String, required: true },
  zipcode: { type: String, required: true }
});

const GradeSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F'],
    required: true
  },
  score: { type: Number, min: 0 }
});

const RestaurantSchema = new mongoose.Schema({
  restaurant_id: {
    type: String,
    required: [true, 'Restaurant ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine is required'],
    trim: true
  },
  borough: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: AddressSchema,
    required: [true, 'Address is required']
  },
  grades: [GradeSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

RestaurantSchema.index({ restaurant_id: 1, cuisine: 1 });

module.exports = mongoose.model('Restaurant', RestaurantSchema);