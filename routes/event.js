const express = require('express');
const router = express.Router();
const {
  deleteEvent,
  getEvent,
  getEventById,
  updateEvent,
  insertEvent,
} = require('../database/db');
const Joi = require('joi');

router.get('/events', async (req, res) => {
  const e = await getEvent();
  res.send(e);
});

router.post('/events', async (req, res) => {
  const data = {
    name: req.body.name,
    files: req.body.files,
    tagline: req.body.tagline,
    schedule: Date.now(),
    description: req.body.description,
    moderator: req.body.moderator,
    category: req.body.category,
    sub_category: req.body.sub_category,
    rigor_rank: req.body.rigor_rank,
  };
  const { error } = validateEvent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const e = await insertEvent(data);
  res.send(e);
});

router.get('/events/:id', async (req, res) => {
  const e = await getEventById(req.params.id);
  res.send(e);
});

router.put('/events/:id', async (req, res) => {
  const { error } = validateEvent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const e = await updateEvent(req.params.id, {
    name: req.body.name,
    files: req.body.files,
    tagline: req.body.tagline,
    schedule: Date.now(),
    description: req.body.description,
    moderator: req.body.moderator,
    category: req.body.category,
    sub_category: req.body.sub_category,
    rigor_rank: req.body.rigor_rank,
  });
  res.send(e);
});

router.delete('/events/:id', async (req, res) => {
  const e = await deleteEvent(req.params.id);
  res.send(e);
});

function validateEvent(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(35).required(),
    tagline: Joi.array().min(1).max(35).required(),
    files: Joi.string().required(),
    description: Joi.string().min(3).max(10000).required(),
    moderator: Joi.array().min(1).max(35).required(),
    category: Joi.string().min(3).max(35).required(),
    sub_category: Joi.array().min(3).max(35).required(),
    rigor_rank: Joi.number().min(0).required(),
  });
  return schema.validate(data);
}

module.exports = router;
