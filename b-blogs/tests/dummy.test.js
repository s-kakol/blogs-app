const dummy = require('../utils/list_helper').dummy;

describe('Dummy', () => {
  test('Dummy returns one', () => {
    const blogs = [];
    const result = dummy(blogs);
    expect(result).toBe(1);
  });
});
