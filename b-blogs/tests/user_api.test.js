const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

describe('When initial DB is empty', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('fuga', 10);
    const user = new User({ username: 'hoge', passwordHash, name: 'hogehoge' });

    await user.save();
  });

  test('Given proper data creates a new user', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'hogehoge',
      password: 'fuga',
      name: 'hogehoge',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('Trying to create user with the same username fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'hoge',
      password: 'fuga',
      name: 'hogehoge',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('Trying to create user without username fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      password: 'fuga',
      name: 'hogehoge',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username and password is required');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('Trying to create user without password fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'hoge',
      name: 'hogehoge',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username and password is required');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('Trying to create user with incorrect username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ho',
      password: 'fuga',
      name: 'hogehoge',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'Username and password must be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('Trying to create user with incorrect password', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'hoge',
      password: 'fu',
      name: 'hogehoge',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'Username and password must be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});
