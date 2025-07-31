import express from 'express';
import cors from 'cors';
import { fakerEN_US, fakerDE, fakerJA } from '@faker-js/faker';
import { generateBook } from './helpers.js';

const app = express();
const PORT = 3001;

app.use(cors());

const fakers = {
  'en-US': fakerEN_US,
  'de-DE': fakerDE,
  'ja': fakerJA,
};

app.get('/api/books', (req, res) => {
  const {
    region = 'en-US',
    seed = 1,
    page = 1,
    likes = 1,
    reviews = 1,
  } = req.query;

  const faker = fakers[region] || fakerEN_US;
  const userSeed = parseInt(seed);
  const currentPage = parseInt(page);
  const avgLikes = parseFloat(likes);
  const avgReviews = parseFloat(reviews);

  const pageSize = currentPage === 1 ? 20 : 10;
  const startIndex = (currentPage === 1) ? 0 : 20 + (currentPage - 2) * 10;

  const books = [];
  for (let i = 0; i < pageSize; i++) {
    const bookIndex = startIndex + i;
    const newBook = generateBook(userSeed, startIndex + i, avgLikes, avgReviews);
    const localizedFaker = fakers[region] || fakerEN_US;
    localizedFaker.seed(userSeed + bookIndex);
    const authorCount = localizedFaker.number.int({ min: 1, max: 2 });
    newBook.authors = Array.from({ length: authorCount }, () => localizedFaker.person.fullName()).join(', ');
    newBook.title = localizedFaker.hacker.phrase().replace(/^./, (c) => c.toUpperCase());
    newBook.publisher = localizedFaker.company.name();

    localizedFaker.seed(userSeed + bookIndex + 500000);
    newBook.reviews = newBook.reviews.map(() => ({
      author: localizedFaker.person.fullName(),
      text: localizedFaker.lorem.paragraph(),
    }));

    books.push(newBook);
  }

  res.json(books);
});

app.listen(PORT, () => {
  console.log(`📚 Fake Book API server running on http://localhost:${PORT}`);
});