
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');


router.get('/', async (req, res, next) => {
  try {
    if (req.query.sortBy) {
      const sortParam = req.query.sortBy.toUpperCase();
      const sortOrder = sortParam === 'ASC' ? 1 : -1;
      const restaurants = await Restaurant.find(
        {},
        { cuisine: 1, name: 1, city: 1, restaurant_id: 1 }
      ).sort({ restaurant_id: sortOrder });
      return res.json(restaurants);
    }
    const restaurants = await Restaurant.find();
    return res.json(restaurants);
  } catch (error) {
    next(error);
  }
});


router.get('/cuisine/:cuisine', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ cuisine: req.params.cuisine });
    return res.json(restaurants);
  } catch (error) {
    next(error);
  }
});


router.get('/Delicatessen', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find(
      {
        cuisine: 'Delicatessen',
        city: { $ne: 'Brooklyn' }
      },
      {
        _id: 0,
        cuisine: 1,
        name: 1,
        city: 1
      }
    ).sort({ name: 1 });
    return res.json(restaurants);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    return res.json(restaurant);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    return res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
});


router.put('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    return res.json(restaurant);
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    return res.json({ message: 'Restaurant deleted successfully', restaurant });
  } catch (error) {
    next(error);
  }
});

module.exports = router;