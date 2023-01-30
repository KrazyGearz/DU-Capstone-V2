import '@babel/polyfill';

import cors from 'cors';
import express from 'express';
import { typeDefs, resolvers } from './schema.js';
import { ApolloServer } from '@apollo/server';
const app = express();
app.use(cors());
app.use(express.json());

const testServer = new ApolloServer({
  typeDefs,
  resolvers
});
describe('Code review 1', () => {
  describe('get book', () => {
    const getbook = `
        query GetBook($getBookId: ID!) {
            getBook(id: $getBookId) {
              title
              id
              description
              coverImage
              categories {
                name
                id
              }
            } 
          }
          `;

    it('should return a book by ID', async () => {
      const response = await testServer.executeOperation({
        query: getbook,
        variables: { getBookId: 2 }
      });
      expect(response.body.singleResult.data).toEqual({
        getBook: {
          title: 'Harry Potter and the Prisoner of Azkaban',
          id: '2',
          description: null,
          coverImage:
            'https://m.media-amazon.com/images/I/51DQeuJ5QDL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
          categories: [
            {
              name: 'Fantasy',
              id: '1'
            },
            {
              name: 'Fiction',
              id: '2'
            }
          ]
        }
      });
    });
    it('Throw error for incorrect book id', async () => {
      const response = await testServer.executeOperation({
        query: getbook,
        variables: { getBookId: 9 }
      });
      expect(response.body.singleResult.errors[0].message).toEqual(
        'This book does not exist.'
      );
    });
  });
  describe('add book', () => {
    const addbook = `
      mutation AddBook($title: String!, $authorId: ID!, $categoryIds: [ID!]!, $addBookDescription2: String) {
        addBook(title: $title, authorId: $authorId, categoryIds: $categoryIds, description: $addBookDescription2) {
          title
          id
          description
          categories {
            id
          }
          author {
            id
          }
        }
      }
          `;
    it('should add a book and return added info', async () => {
      const response = await testServer.executeOperation({
        query: addbook,
        variables: {
          addBookDescription2: 'This is a description',
          title: 'Some great book',
          authorId: 2,
          categoryIds: [1, 2]
        }
      });
      expect(response.body.singleResult.data).toEqual({
        addBook: {
          title: 'Some great book',
          id: '5',
          description: 'This is a description',
          categories: [
            {
              id: '1'
            },
            {
              id: '2'
            }
          ],
          author: {
            id: '2'
          }
        }
      });
    });
  });
});

describe('Code review 2', () => {
  describe('get author', () => {
    const getAuthor = `
    query GetAuthor($getAuthorId: ID!) {
      getAuthor(id: $getAuthorId) {
        books {
          description
          id
          title
        }
      }
    }
          `;

    it('retrieve books by author id', async () => {
      const response = await testServer.executeOperation({
        query: getAuthor,
        variables: { getAuthorId: 1 }
      });
      expect(response.body.singleResult.data).toEqual({
        getAuthor: {
          books: [
            {
              description:
                'Harry Potter and the Chamber of Secrets is a 1998 young adult fantasy novel by J.K. Rowling, the second in the Harry Potter series. The story follows Harry’s tumultuous second year at Hogwarts School of Witchcraft and Wizardry, including an encounter with Voldemort, the wizard who killed Harry’s parents. Against this fantastic backdrop, Rowling examines such themes as death, fame, friendship, choice, and prejudice. Upon release, the novel became a worldwide bestseller and won several awards, including Children’s Book of the Year at the British Book Awards and the Nestlé Smarties Book Award; it was subsequently adapted into a 2002 film directed by Chris Columbus.',
              id: '1',
              title: 'Harry Potter and the Chamber of Secrets'
            },
            {
              description: null,
              id: '2',
              title: 'Harry Potter and the Prisoner of Azkaban'
            },
            {
              description: null,
              id: '3',
              title: 'Harry Potter and the Goblet of Fire'
            }
          ]
        }
      });
    });
    it('Throw error for incorrect author id', async () => {
      const response = await testServer.executeOperation({
        query: getAuthor,
        variables: { getAuthorId: 9 }
      });
      expect(response.body.singleResult.errors[0].message).toEqual(
        'This author does not exist.'
      );
    });
  });
  describe('add category', () => {
    const addCategory = `
    mutation AddCategory($name: String!, $bookIds: [ID]) {
      addCategory(name: $name, bookIds: $bookIds) {
        id
        name
        books {
          id
        }
      }
    }
          `;

    it('should add category and return category details', async () => {
      const response = await testServer.executeOperation({
        query: addCategory,
        variables: { name: 'manga', bookIds: [1, 2, 3] }
      });
      expect(response.body.singleResult.data).toEqual({
        addCategory: {
          id: '4',
          name: 'manga',
          books: [{ id: '1' }, { id: '2' }, { id: '3' }]
        }
      });
    });
  });

  describe('update book', () => {
    const updateBook = `
    mutation UpdateBook($updateBookTitle2: String!, $updateBookAuthorId2: ID, $updateBookDescription2: String, $updateBookCategoryIds2: [ID], $updateBookId: ID!) {
      updateBook(title: $updateBookTitle2, authorId: $updateBookAuthorId2, description: $updateBookDescription2, categoryIds: $updateBookCategoryIds2, id: $updateBookId) {
        id
        title
        author {
          id
        }
        categories {
          id
        }
        description
      }
    }
          `;

    it('should update book and return details', async () => {
      const response = await testServer.executeOperation({
        query: updateBook,
        variables: {
          updateBookTitle2: 'black clover',
          updateBookAuthorId2: 4,
          updateBookDescription2: 'Ill become wizard king!',
          updateBookCategoryIds2: ['2'],
          updateBookId: 1
        }
      });
      expect(response.body.singleResult.data).toEqual({
        updateBook: {
          id: '1',
          title: 'black clover',
          author: {
            id: '4'
          },
          categories: [
            {
              id: '2'
            }
          ],
          description: 'Ill become wizard king!'
        }
      });
    });
  });
});

describe('Code review 3', () => {
  describe('get category', () => {
    const getCategory = `
    query Query($getCategoryId: ID!) {
      getCategory(id: $getCategoryId) {
        id
        books {
          id
        }
      }
    }
          `;

    it('should return a book by ID', async () => {
      const response = await testServer.executeOperation({
        query: getCategory,
        variables: { getCategoryId: 1 }
      });
      expect(response.body.singleResult.data).toEqual({
        getCategory: {
          id: '1',
          books: [
            {
              id: '1'
            },
            {
              id: '2'
            },
            {
              id: '3'
            }
          ]
        }
      });
    });
    it('Throw error for incorrect category id', async () => {
      const response = await testServer.executeOperation({
        query: getCategory,
        variables: { getCategoryId: 9 }
      });
      expect(response.body.singleResult.errors[0].message).toEqual(
        'This category does not exist.'
      );
    });
  });
});
