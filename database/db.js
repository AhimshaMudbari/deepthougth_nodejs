const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGOURI;
const dbname = 'Festive';

let db;

async function run() {
  MongoClient.connect(uri).then((client) => {
    db = client.db(dbname);
  });
}

const insertEvent = ({
  name,
  files,
  tagline,
  schedule,
  description,
  moderator,
  category,
  sub_category,
  rigor_rank,
}) => {
  const collection = db.collection('event');
  return collection.insertOne({
    name,
    files,
    tagline,
    schedule,
    description,
    moderator,
    category,
    sub_category,
    rigor_rank,
  });
};

const getEvent = () => {
  const pgno = 2;
  const pgsize = 5;
  const collection = db.collection('event');
  return collection
    .find()
    .toArray()
    .sort('schedule')
    .limit(pgsize)
    .skip((pgno - 1) * pgsize);
};

const getEventById = (id) => {
  const collection = db.collection('event');
  return collection.findOne({ _id: ObjectId(id) });
};
const updateEvent = (
  id,
  {
    name,
    tagline,
    files,
    description,
    schedule,
    moderator,
    category,
    sub_category,
    rigor_rank,
  }
) => {
  const collection = db.collection('event');
  return collection.updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        name: name,
        tagline,
        files,
        description,
        schedule,
        moderator,
        category,
        sub_category,
        rigor_rank,
      },
    }
  );
};

const deleteEvent = (id) => {
  const collection = db.collection('event');

  return collection.deleteOne({ _id: ObjectId(id) });
};

run().catch(console.error);

module.exports = {
  run,
  insertEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEvent,
};
