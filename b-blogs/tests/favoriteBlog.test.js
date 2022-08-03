const favoriteBlog = require('../utils/list_helper').favoriteBlog;
const { blogs, listWithOneBlog } = require('./mockData');

describe('Favorite blog', () => {
  test('Of a list with one blog is the one blog', () => {
    const result = favoriteBlog(listWithOneBlog);
    expect(result).toEqual(listWithOneBlog[0]);
  });

  test('Of a bigger list is picked right', () => {
    const result = favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
  });
});
``