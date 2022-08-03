import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const blogFormRef = useRef();

  const compare = (a, b) => {
    if (a.likes < b.likes) {
      return 1;
    } else if (a.likes > b.likes) {
      return -1;
    }
    return 0;
  };

  useEffect(() => {
    const sort = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs.sort(compare));
    };
    sort();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async user => {
    try {
      const loggedUser = await loginService.login(user);
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      );
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
    } catch (exception) {
      setIsError(true);
      setMessage('Wrong username or password!');
      setTimeout(() => {
        setMessage(null);
        setIsError(false);
      }, 5000);
    }
  };

  const handleLogout = event => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const saveBlog = async blogObject => {
    blogFormRef.current.toggleVisibility();
    const savedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(savedBlog));
    setMessage(`${blogObject.title} saved successfully!`);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const updateBlog = async id => {
    const blog = blogs.find(b => b.id === id);
    const updatedBlog = await blogService.update(id, {
      ...blog,
      likes: blog.likes + 1,
    });
    setBlogs(
      blogs.map(blog => (blog.id !== id ? blog : updatedBlog)).sort(compare)
    );
  };

  const removeBlog = async id => {
    const blog = blogs.find(b => b.id === id);
    if (window.confirm(`Do you want to remove ${blog.title}?`)) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (error) {
        setIsError(true);
        setMessage('You can delete only your blogs');
        setTimeout(() => {
          setMessage(null);
          setIsError(false);
        }, 5000);
      }
    }
  };

  const blogList = () => {
    return (
      <>
        <p id="welcome-msg">Hello {user.name}</p>
        {blogForm()}
        <ul>
          {blogs.map(blog => (
            <li key={blog.id}>
              <Blog
                blog={blog}
                increaseLikes={updateBlog}
                removeBlog={removeBlog}
                currentUser={user.name}
              />
            </li>
          ))}
        </ul>
        <button id="logout-btn" type="submit" onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  };

  const blogForm = () => (
    <Togglable buttonLabel="New Blog" ref={blogFormRef}>
      <BlogForm createBlog={saveBlog} />
    </Togglable>
  );

  const notification = () => {
    if (message) {
      return (
        <div style={{ backgroundColor: 'lightgrey' }}>
          <p
            className="notification"
            style={isError ? { color: 'red' } : { color: 'green' }}
          >
            {message}
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      {notification()}
      <h2>Blog list</h2>
      {user === null ? <LoginForm loginUser={handleLogin} /> : blogList()}
    </div>
  );
};

export default App;
