const mostBlogs = require('../utils/list_helper').mostBlogs;
const { blogs, listWithOneBlog } = require('./mockData');

describe('Author of most blogs', () => {
  test('Of a list with one blog is the only author', () => {
    const result = mostBlogs(listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('Of a bigger list is picked right', () => {
    const result = mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});
