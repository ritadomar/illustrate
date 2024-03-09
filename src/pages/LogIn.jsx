/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from 'react';
import { logIn } from '../api/auth.api';
import { AuthContext } from '../context/auth.context';
import { Link, useNavigate } from 'react-router-dom';

function LogIn() {
  const { isLoggedIn, storeToken, authenticateUser } = useContext(AuthContext);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const user = { credential, password };

    try {
      // login responds with the jwt
      const response = await logIn(user);

      storeToken(response.data.authToken);
      authenticateUser();
      navigate('/');
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <main className="Authentication">
      <h1>Log In</h1>

      <p>
        Don't have an account? <Link to={'/signup'}>Register</Link>
      </p>

      <form onSubmit={handleSubmit}>
        <h2>Welcome back!</h2>

        {/* Email */}
        <label htmlFor="credential">
          Email or username:
          <input
            type="string"
            name="credential"
            id="credential"
            required
            value={credential}
            onChange={({ target }) => setCredential(target.value)}
            placeholder="artist@email.com"
          />
        </label>

        {/* Password */}
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="••••••••"
          />
        </label>
        <button type="submit">Log In</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}

export default LogIn;
