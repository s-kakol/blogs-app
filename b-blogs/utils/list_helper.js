const lodash = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0) / blogs.length;
};

const favoriteBlog = blogs => {
  const reducer = (prev, current) => {
    return prev.likes > current.likes ? prev : current;
  };

  return blogs.reduce(reducer, {});

  // return blogs.reduce((prev, current) => {
  //   return prev.likes > current.likes ? prev : current;
  // });
};

const mostBlogs = blogs => {
  const author = lodash
    .chain(blogs)
    .groupBy('author')
    .map((group, author) => {
      return { author: author, blogs: group.length };
    })
    .maxBy(object => object.blogs)
    .value();

  return author;
};

const mostLikes = blogs => {
  const author = lodash
    .chain(blogs)
    .groupBy('author')
    .map((group, author) => {
      return {
        author: author,
        likes: group.reduce((amount, next) => {
          return (amount += next.likes);
        }, 0),
      };
    })
    .maxBy(object => object.likes)
    .value();

  return author;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
