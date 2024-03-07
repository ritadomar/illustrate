import { useState } from 'react';
import { signUp } from '../api/auth.api';
import { upload } from '../api/upload.api';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isArtist, setIsArtist] = useState(false);
  const [portfolio, setPortfolio] = useState('');
  const [rate, setRate] = useState(0);
  const [avatar, setAvatar] = useState();
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleRole = e => {
    console.log(e.target.value);
    setIsArtist(e.target.value);
  };

  const handleAvatar = ({ target }) => {
    console.log(target.files[0]);
    setAvatar(target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const user = {
      email,
      password,
      name,
      username,
      isArtist,
      portfolio,
      rate,
    };
    try {
      if (avatar) {
        // create a form type that is able to handle images // multipart/form-data
        const uploadData = new FormData();
        uploadData.append('file', avatar);

        const response = await upload(uploadData);
        console.log(response.data);

        user.avatarUrl = response.data.imgUrl;
      }

      await signUp(user);
      navigate('/login');
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {/* Is Artist */}
        <fieldset>
          <legend>Tell us a bit about you:</legend>
          <label>
            <input
              type="radio"
              name="isArtist"
              value="true"
              onChange={handleRole}
            ></input>
            I'm an Artist
          </label>
          <label>
            <input
              type="radio"
              name="isArtist"
              value="false"
              onChange={handleRole}
            ></input>
            I'm a Client
          </label>
        </fieldset>

        {/* Email */}
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={({ target }) => setEmail(target.value)}
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

        {/* Name */}
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={({ target }) => setName(target.value)}
            placeholder="Lois"
          />
        </label>

        {/* Username */}
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            id="username"
            required
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            placeholder="loish"
          />
        </label>

        {/* Avatar */}
        <label htmlFor="avatar">
          Choose your avatar:
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={handleAvatar}
          />
        </label>

        {/* IS ARTIST */}
        {/* Portfolio */}
        {/* Rate */}
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default SignUp;
