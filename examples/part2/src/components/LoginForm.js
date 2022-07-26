import { useState } from 'react';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = ({ target }) => setUsername(target.value);
  const handlePasswordChange = ({ target }) => setPassword(target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input type="text" value={username}
            onChange={handleUsernameChange} id='username'/>
        </div>
        <div>
          password
          <input type="password" value={password}
            onChange={handlePasswordChange} id='password'/>
        </div>
        <button type='submit' id='login-button'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;