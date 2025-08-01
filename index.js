import express from 'express';
import cors from 'cors';
import { generateBook } from './helpers.js';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/books', (req, res) => {
  const {
    region = 'en-US',
    seed = 1,
    page = 1,
    likes = 1,
    reviews = 1,
  } = req.query;

  const userSeed = parseInt(seed);
  const currentPage = parseInt(page);
  const avgLikes = parseFloat(likes);
  const avgReviews = parseFloat(reviews);

  const pageSize = currentPage === 1 ? 20 : 10;
  const startIndex = (currentPage === 1) ? 0 : 20 + (currentPage - 2) * 10;

  const books = [];
  for (let i = 0; i < pageSize; i++) {
    const bookIndex = startIndex + i;
    const newBook = generateBook(userSeed, bookIndex, avgLikes, avgReviews, region);
    books.push(newBook);
  }

  res.json(books);
});

app.listen(PORT, () => {
  console.log(`📚 Fake Book API server running on http://localhost:${PORT}`);
});