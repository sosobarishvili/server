import { fakerEN_US, fakerDE, fakerJA } from '@faker-js/faker';


export const generateCount = (average) => {
  if (average <= 0) return 0;
  const baseCount = Math.floor(average);
  const fractionalPart = average - baseCount;

  return baseCount + (Math.random() < fractionalPart ? 1 : 0);
};

const fakers = {
  'en-US': fakerEN_US,
  'de-DE': fakerDE,
  'ja': fakerJA,
};

export const generateBook = (userSeed, bookIndex, likes, reviews, region) => {
  const localizedFaker = fakers[region] || fakerEN_US;

  localizedFaker.seed(userSeed + bookIndex);

  const authorCount = localizedFaker.number.int({ min: 1, max: 2 });
  const authors = Array.from({ length: authorCount }, () => localizedFaker.person.fullName()).join(', ');

  const book = {
    id: `isbn-${userSeed}-${bookIndex}`,
    isbn: localizedFaker.commerce.isbn(),
    title: localizedFaker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
    authors: authors,
    publisher: localizedFaker.company.name(),
  };

  localizedFaker.seed(userSeed + bookIndex + 500000);

  const numLikes = generateCount(likes);
  const numReviews = generateCount(reviews);

  book.likes = numLikes;
  book.reviews = Array.from({ length: numReviews }, () => ({
    author: localizedFaker.person.fullName(),
    text: localizedFaker.lorem.paragraph(),
  }));
  book.index = bookIndex + 1;

  return book;
};
