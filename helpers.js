import { faker } from '@faker-js/faker';

const generateCount = (average) => {
  if (average <= 0) return 0;
  const baseCount = Math.floor(average);
  const fractionalPart = average - baseCount;
  return baseCount + (faker.number.float() < fractionalPart ? 1 : 0);
};

export const generateBook = (userSeed, bookIndex, likes, reviews) => {
  faker.seed(userSeed + bookIndex);

  const authorCount = faker.number.int({ min: 1, max: 3 });
  const authors = Array.from({ length: authorCount }, () => faker.person.fullName()).join(', ');

  const book = {
    id: `isbn-${userSeed}-${bookIndex}`,
    index: bookIndex + 1,
    isbn: faker.commerce.isbn(),
    title: faker.commerce.productName(),
    authors: authors,
    publisher: faker.company.name(),
  };

  faker.seed(userSeed + bookIndex + 500000);

  const numLikes = generateCount(likes);
  const numReviews = generateCount(reviews);

  book.likes = numLikes;
  book.reviews = Array.from({ length: numReviews }, () => ({
    author: faker.person.fullName(),
    text: faker.lorem.paragraph(),
  }));

  return book;
};