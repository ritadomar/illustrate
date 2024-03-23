import { useState, useEffect, useContext } from 'react';
import { signUp } from '../api/auth.api';
import { upload } from '../api/upload.api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import signupImage from '../assets/signup.jpg';
import { Button } from 'primereact/button';
import artistsImage from '../assets/oc-growing.svg';
import buyersImage from '../assets/oc-hi-five.svg';

// import { avgSalary as getAvgSalary } from '../api/ine.api';

function SignUp() {
  const { isSigning, setIsSigning } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isArtist, setIsArtist] = useState(null);
  const [portfolio, setPortfolio] = useState('');
  const [rate, setRate] = useState('');
  const [avatar, setAvatar] = useState();
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [avgSalary, setAvgSalary] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState();

  useEffect(() => {
    setIsSigning(true);
    return () => {
      setIsSigning(false);
    };
  }, []);

  const calcAvgSalary = () => {
    setAvgSalary(Math.round((1780.1 / 22 / 8) * 100) / 100);
  };
  useEffect(() => {
    calcAvgSalary();
  }, []);

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  const nextStep = () => {
    setStep(step => step + 1);
  };
  const previousStep = () => {
    step > 1 && setStep(step => step - 1);
  };

  const handleRole = e => {
    console.log(e.target.value);
    e.target.value === 'true' ? setIsArtist(true) : setIsArtist(false);
  };

  const handleAvatar = ({ target }) => {
    console.log(target.files[0]);
    setAvatar(target.files[0]);
    setAvatarUrl(URL.createObjectURL(target.files[0]));
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
    <main className="grid grid-cols-12 gap-10 h-screen pr-10">
      <div className="col-span-5 h-screen">
        <img src={signupImage} alt="" className="h-full object-cover" />
      </div>
      <div className="col-span-7 h-screen flex flex-col items-center pt-20 gap-2">
        <h1 className="text-2xl font-semibold">Sign up to illlu</h1>
        {step === 1 && (
          <p className=" mb-8 text-sm text-black-a-5">
            Already have an account?{' '}
            <Link
              to={'/login'}
              className="font-semibold hover:text-brand text-black"
            >
              Log In
            </Link>
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-8"
        >
          {/* Is Artist */}
          {step === 1 && (
            <>
              <h2 className="text-3xl font-semibold ">
                How are you planning to use Illu?
              </h2>
              <div className="grid grid-cols-2 gap-4 w-10/12">
                <label className="p-4 border-brand/30 border-2 rounded-lg flex flex-col items-end gap-4 has-[:checked]:bg-brand/10 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0">
                  <input
                    type="radio"
                    name="isArtist"
                    value="true"
                    checked={isArtist === true}
                    onChange={handleRole}
                    className="border-2 border-white h-4 w-4 rounded-full checked:bg-brand-hover checked:ring-brand-hover appearance-none ring-2 ring-brand/30"
                  />
                  <img
                    src={artistsImage}
                    alt=""
                    className="w-11/12 object-fit"
                  />
                  <span className="w-full text-md">
                    For posting and selling my art
                  </span>
                </label>
                <label className="p-4 border-brand/30 border-2 rounded-lg flex flex-col items-end gap-4 has-[:checked]:bg-brand/10 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0">
                  <input
                    type="radio"
                    name="isArtist"
                    value="false"
                    checked={isArtist === false}
                    onChange={handleRole}
                    className="border-2 border-white h-4 w-4 rounded-full checked:bg-brand-hover checked:ring-brand-hover appearance-none ring-2 ring-brand/30"
                  />
                  <img
                    src={buyersImage}
                    alt=""
                    className="w-11/12 object-fit"
                  />
                  <span className="w-full text-md">
                    For finding and hiring artists
                  </span>
                </label>
              </div>

              <div>
                <Button
                  label="Back"
                  severity="secondary"
                  text
                  rounded
                  className="hover:text-brand-hover hover:bg-brand/0"
                  onClick={goBack}
                />
                <Button
                  onClick={nextStep}
                  label="Continue"
                  rounded
                  className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Welcome to Illu</h2>
              <p>Tell us a bit about yourself</p>
              {/* Avatar */}
              <label htmlFor="avatar">
                {avatar && (
                  <>
                    Edit avatar:
                    <img src={avatarUrl} alt="" width={100} />
                  </>
                )}
                {!avatar && 'Add an avatar:'}
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  onChange={handleAvatar}
                />
              </label>

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
              {isArtist && (
                <>
                  {/* IS ARTIST */}
                  {/* Portfolio */}
                  <label htmlFor="portfolio">
                    Portfolio:
                    <input
                      type="url"
                      name="portfolio"
                      id="portfolio"
                      required
                      value={portfolio}
                      onChange={({ target }) => setPortfolio(target.value)}
                      placeholder="http://www.portfolio.com"
                    />
                  </label>
                  <Button
                    label="Back"
                    severity="secondary"
                    text
                    rounded
                    className="hover:text-brand-hover hover:bg-brand/0"
                    onClick={previousStep}
                  />
                  <Button
                    label="Continue"
                    rounded
                    className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                    onClick={nextStep}
                  />
                </>
              )}
              {!isArtist && (
                <>
                  <Button
                    label="Back"
                    severity="secondary"
                    text
                    rounded
                    className="hover:text-brand-hover hover:bg-brand/0"
                    onClick={previousStep}
                  />
                  <Button
                    label="Register"
                    rounded
                    className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                    type="submit"
                  />
                </>
              )}
            </>
          )}

          {/* IS ARTIST */}
          {isArtist && step === 3 && (
            <>
              <h2>We are here to help you price your art</h2>
              {/* Rate */}
              <label htmlFor="rate">
                Hourly rate:
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  required
                  value={rate}
                  onChange={({ target }) => {
                    setRate(target.value);
                  }}
                  placeholder={avgSalary + '€'}
                />
                <p>
                  We recommend a minimum hourly rate of {avgSalary}€. This rate
                  is calculated from the monthly average base salary of workers
                  in the arts, entertainment, sports and recreation activities
                  sector, in Portugal in 2021
                </p>
              </label>

              {/* SUBMIT */}
              <Button
                label="Back"
                severity="secondary"
                text
                rounded
                className="hover:text-brand-hover hover:bg-brand/0"
                onClick={previousStep}
              />
              <Button
                label="Register"
                rounded
                className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                type="submit"
              />
            </>
          )}
        </form>
        {error && <p>{error}</p>}
      </div>
    </main>
  );
}

export default SignUp;
