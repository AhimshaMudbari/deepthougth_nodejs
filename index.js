const express = require('express');
const app = express();
const event = require('./routes/event');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGOURI;

app.use(express.json());
app.use('/api/v3/app', event);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const client = new MongoClient(uri);
async function connectDb() {
  try {
    await client.connect().then(() => {
      console.log('connected to database');
    });
    const database = client.db('task-I');
    const col = database.createCollection(
      'events',
      {
        name: String,
        files: {
          data: Buffer,
          contentType: String,
        },
        tagline: String,
        schedule: {
          type: Date,
        },
        description: String,
        moderator: String,
        category: {
          type: Array,
          require: function (value) {
            return value && value.length > 0;
          },
        },
        sub_category: [String],
        rigor_rank: Number,
      },
      () => {
        console.log('collection created successfully');
      }
    );
  } catch (e) {
    console.log('Failed to connect: ', e.message);
  } finally {
    await client.close();
  }
}
connectDb().catch(console.error);
