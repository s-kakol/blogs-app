const totalLikes = require('../utils/list_helper').totalLikes;
const { blogs, listWithOneBlog } = require('./mockData');

describe('Total likes', () => {
  test('Of empty list is 0', () => {
    const result = totalLikes([]);
    expect(result).toBe(0);
  });

  test('Of only one blog equals the likes of that blog', () => {
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('Of a bigger list is calculated right', () => {
    const result = totalLikes(blogs);
    expect(result).toBe(6);
  });
});
