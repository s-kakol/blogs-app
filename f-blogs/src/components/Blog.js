import React, { useState } from 'react';

const Blog = ({ blog, increaseLikes, removeBlog, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false);
  const blogStyle = {
    padding: 5,
    paddingTop: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    maxWidth: 'fit-content',
  };
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const showTitle = () => (
    <div className="collapsed-blog">
      {`${blog.title} by ${blog.author} `}
      <button className="expand-blog-btn" onClick={toggleDetails}>
        View
      </button>
    </div>
  );

  const removeButton = () => (
    <div>
      <button className="remove-blog-btn" onClick={() => removeBlog(blog.id)}>
        Remove
      </button>
    </div>
  );

  const expandedBlog = () => (
    <div style={blogStyle} className="expanded-blog">
      <div>
        {`${blog.title} by ${blog.author} `}
        <button className="collapse-blog-btn" onClick={toggleDetails}>
          Hide
        </button>
      </div>
      <div className="blog-url">{`Link: ${blog.url} `}</div>
      <div className="blog-likes">
        {`Likes: ${blog.likes} `}
        <button
          className="blog-like-btn"
          onClick={() => increaseLikes(blog.id)}
        >
          Like!
        </button>
      </div>
      <div>{`User: ${blog.user.name} `}</div>
      {blog.user.name === currentUser ? removeButton() : null}
    </div>
  );

  return <div>{showDetails ? expandedBlog() : showTitle()}</div>;
};

export default Blog;
