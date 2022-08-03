const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Test Blog-01',
    author: 'Test Author-01',
    url: 'Test url-01',
    likes: 3,
  },
  {
    title: 'Test Blog-02',
    author: 'Test Author-02',
    url: 'Test url-02',
    likes: 7,
  },
  {
    title: 'Test Blog-03',
    author: 'Test Author-01',
    url: 'Test url-03',
    likes: 2,
  },
  {
    title: 'Test Blog-04',
    author: 'Test Author-02',
    url: 'Test url-04',
  },
  {
    title: 'Test Blog-05',
    author: 'Test Author-02',
    url: 'Test url-05',
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('Blog API', () => {
  test('Blogs are returned as JSON', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);
    expect(response.statusCode).toEqual(200);
    expect(response.type).toEqual('application/json');
  });

  test('Blogs have a defined id field', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
      expect(blog._id).not.toBeDefined();
    });
  });

  test('A valid blog can be added', async () => {
    const newBlog = {
      title: 'Valid test Title',
      author: 'Valid test Author',
      url: 'Valid test url',
      likes: 3,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await api.get('/api/blogs');
    expect(blogs.body).toHaveLength(initialBlogs.length + 1);
    expect(blogs.body[blogs.body.length - 1].title).toContain(
      'Valid test Title'
    );
    expect(blogs.body[blogs.body.length - 1].author).toContain(
      'Valid test Author'
    );
    expect(blogs.body[blogs.body.length - 1].url).toContain('Valid test url');
  });

  test('Blog without likes property will default property to 0', async () => {
    const newBlog = {
      title: 'NoLikes test Title',
      author: 'NoLikes test Author',
      url: 'NoLikes test url',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await api.get('/api/blogs');
    expect(blogs.body[blogs.body.length - 1].likes).toEqual(0);
  });

  test('Blog without title or url property will be rejected', async () => {
    const newBlog = {
      author: 'Invalid test Author',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  test('Blog can be deleted given proper id', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToDelete = blogsAtStart.body[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await api.get('/api/blogs');
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1);
  });

  test('Blog likes property can be updated given proper id', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToUpdate = blogsAtStart.body[0];
    const updatedBlog = {
      ...blogToUpdate,
      likes: 30,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await api.get('/api/blogs');
    expect(blogsAtEnd.body[0].likes).toEqual(updatedBlog.likes);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
