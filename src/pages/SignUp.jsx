import { useState, useEffect } from 'react';
import { signUp } from '../api/auth.api';
import { upload } from '../api/upload.api';
import { Link, useNavigate } from 'react-router-dom';
// import { avgSalary as getAvgSalary } from '../api/ine.api';

function SignUp() {
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

  // const getSalary = async () => {
  //   try {
  //     const response = await getAvgSalary();
  //     console.log(response);
  //     const monthlySalary = response;
  //     const hourlySalary = monthlySalary / 22 / 8;
  //     setAvgSalary(hourlySalary);
  //     console.log(avgSalary);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getSalary();
  // }, []);
  const calcAvgSalary = () => {
    setAvgSalary(Math.round((1780.1 / 22 / 8) * 100) / 100);
  };
  useEffect(() => {
    calcAvgSalary();
  }, []);

  const navigate = useNavigate();

  const nextStep = () => {
    setStep(step => step + 1);
  };
  const previousStep = () => {
    step > 1 && setStep(step => step - 1);
  };

  const handleRole = e => {
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
    <main className="Authentication">
      <h1>Sign Up</h1>
      {step === 1 && (
        <p>
          Already have an account? <Link to={'/login'}>Log In</Link>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {/* Is Artist */}
        {step === 1 && (
          <>
            <h2>How are you planning to use Illu?</h2>
            <label className="radio">
              <input
                type="radio"
                name="isArtist"
                value="true"
                checked={isArtist === true}
                onChange={handleRole}
              ></input>
              For posting and selling my art
            </label>
            <label className="radio">
              <input
                type="radio"
                name="isArtist"
                value="false"
                checked={isArtist === false}
                onChange={handleRole}
              ></input>
              For finding artists and buying commissions
            </label>
            <button onClick={nextStep}>Continue</button>
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
                <button onClick={previousStep}>Back</button>
                <button onClick={nextStep}>Continue</button>
              </>
            )}
            {!isArtist && (
              <>
                <button onClick={previousStep}>Back</button>
                <button type="submit">Register</button>
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
                We recommend a minimum hourly rate of {avgSalary}€. This rate is
                calculated from the monthly average base salary of workers in
                the arts, entertainment, sports and recreation activities
                sector, in Portugal in 2021
              </p>
            </label>

            {/* SUBMIT */}
            <button onClick={previousStep}>Back</button>
            <button type="submit">Register</button>
          </>
        )}
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}

export default SignUp;
