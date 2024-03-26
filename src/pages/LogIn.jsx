/* eslint-disable react/no-unescaped-entities */
import { useContext, useState, useEffect } from 'react';
import { logIn } from '../api/auth.api';
import { AuthContext } from '../context/auth.context';
import { Link, useNavigate } from 'react-router-dom';
import signupImage from '../assets/signup.jpg';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import ErrorMessage from '../components/ErrorMessage';

function LogIn() {
  const { isLoggedIn, storeToken, authenticateUser, isSigning, setIsSigning } =
    useContext(AuthContext);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

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

  useEffect(() => {
    setIsSigning(true);
    return () => {
      setIsSigning(false);
    };
  }, []);

  return (
    <main className="grid grid-cols-12 gap-10 h-screen pr-10">
      <div className="col-span-5 h-screen">
        <img
          src={signupImage}
          alt=""
          className="h-full object-cover object-right"
        />
      </div>
      <div className="col-span-7 h-screen flex flex-col items-center pt-16 gap-2">
        <h1 className="text-2xl font-semibold">Log in to illlu</h1>
        <p className="mb-8 text-sm text-black-a-5">
          Don't have an account yet?{' '}
          <Link
            to={'/signup'}
            className="font-semibold hover:text-brand text-black"
          >
            Register
          </Link>
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-8"
        >
          <h2 className="text-3xl font-semibold ">Welcome back!</h2>

          {/* Email */}
          <label
            htmlFor="credential"
            className="flex flex-col w-6/12 font-semibold gap-1"
          >
            Email or username
            <InputText
              type="text"
              name="credential"
              id="credential"
              required
              value={credential}
              onChange={({ target }) => setCredential(target.value)}
              placeholder="email@email.com"
              className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand"
              pt={{
                root: {
                  className:
                    'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal',
                },
              }}
            />
          </label>

          {/* Password */}
          <label
            htmlFor="password"
            className="flex flex-col w-6/12 font-semibold gap-1"
          >
            Password
            <Password
              type="password"
              name="password"
              id="password"
              required
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="8+ characters"
              toggleMask
              className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none "
              pt={{
                input: {
                  className:
                    'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none w-full valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand',
                },
              }}
            />
          </label>

          {error && <ErrorMessage error={error} className="w-6/12" />}
          <div className="flex items-center gap-4">
            <Button
              label="Back"
              severity="secondary"
              text
              rounded
              className="hover:text-brand-hover hover:bg-brand/0"
              onClick={goBack}
            />
            <Button
              label="Log In"
              rounded
              className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
              type="submit"
            />
          </div>
        </form>
      </div>
    </main>
  );
}

export default LogIn;
