const mostLikes = require('../utils/list_helper').mostLikes;
const { blogs, listWithOneBlog } = require('./mockData');

describe('Author of most liked blogs', () => {
  test('Of a list with one blog is the only author', () => {
    const result = mostLikes(listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('Of a bigger list is picked right', () => {
    const result = mostLikes(blogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});