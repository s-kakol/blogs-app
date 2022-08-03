import React, { useState } from 'react';

const LoginForm = ({ loginUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const prepareUser = event => {
    event.preventDefault();
    loginUser({
      username: username,
      password: password,
    });
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={prepareUser}>
      <div>
        {`Username: `}
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        {`Password: `}
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-btn" type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
