import { useState, useEffect, useContext } from 'react';
import { signUp } from '../api/auth.api';
import { upload } from '../api/upload.api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import signupImage from '../assets/signup.jpg';
import { Button } from 'primereact/button';
import artistsImage from '../assets/oc-growing.svg';
import buyersImage from '../assets/oc-hi-five.svg';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputNumber } from 'primereact/inputnumber';
import ErrorMessage from '../components/ErrorMessage';

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
        <img
          src={signupImage}
          alt=""
          className="h-full object-cover object-right"
        />
      </div>
      <div className="col-span-7 h-screen flex flex-col items-center pt-16 gap-2">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-semibold">Sign up to illlu</h1>
            <p className="mb-8 text-sm text-black-a-5">
              Already have an account?{' '}
              <Link
                to={'/login'}
                className="font-semibold hover:text-brand text-black"
              >
                Log In
              </Link>
            </p>
          </>
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
                <label className="p-4 border-accent-light border-2 rounded-lg flex flex-col items-end gap-4 has-[:checked]:bg-accent-light/50 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0">
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
                <label className="p-4 border-accent-light border-2 rounded-lg flex flex-col items-end gap-4 has-[:checked]:bg-accent-light/50 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0">
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

              <div className="flex items-center gap-4">
                <Button
                  label="Back"
                  severity="secondary"
                  text
                  rounded
                  className="text-grey hover:text-brand-hover hover:bg-brand/0"
                  onClick={goBack}
                />
                {isArtist === null && (
                  <Button
                    onClick={nextStep}
                    label="Continue"
                    rounded
                    disabled
                    className="bg-black-a-5/30 border-black-a-5/0 hover:border-opacity-0 hover:bg-brand-hover"
                  />
                )}
                {isArtist !== null && (
                  <Button
                    onClick={nextStep}
                    label="Continue"
                    rounded
                    className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                  />
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-semibold hidden">
                Sign up to illlu
              </h1>
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-semibold">Welcome to illlu</h2>
                <p className="mb-2 text-sm text-black-a-5">
                  Tell us a bit about yourself
                </p>
              </div>
              <div className="w-full flex flex-col items-center gap-4">
                {/* Avatar */}
                {!avatar && (
                  <label
                    htmlFor="avatar"
                    className=" group cursor-pointer flex flex-col gap-2 items-center font-semibold mb-2 hover:text-brand-hover"
                  >
                    <div className="cursor-pointer w-20 h-20 rounded-full bg-brand-hover/5 border-2 border-dashed border-brand-hover flex justify-center items-center text-brand-hover group-hover:bg-brand-hover/30">
                      <i className="pi pi-camera text-xl" />
                    </div>
                    Upload avatar
                  </label>
                )}
                {avatar && (
                  <label
                    htmlFor="avatar"
                    className="group cursor-pointer flex flex-col gap-2 items-center hover:text-brand-hover  font-semibold mb-2"
                  >
                    <img
                      src={avatarUrl}
                      alt=""
                      className="cursor-pointer w-20 h-20 object-cover object-top rounded-full border-2 border-dashed border-brand-hover "
                    />
                    Edit avatar
                  </label>
                )}
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  onChange={handleAvatar}
                  className="uploadAvatar cursor-pointer"
                  hidden
                />

                <div className="grid grid-cols-2 w-6/12 gap-4">
                  {/* Name */}
                  <label
                    htmlFor="name"
                    className="flex flex-col font-semibold gap-1"
                  >
                    Name
                    <InputText
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={name}
                      onChange={({ target }) => setName(target.value)}
                      placeholder="Lois van Baarle"
                      className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand"
                      pt={{
                        root: {
                          className:
                            'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal',
                        },
                      }}
                    />
                  </label>

                  {/* Username */}
                  <label
                    htmlFor="username"
                    className="flex flex-col font-semibold gap-1"
                  >
                    Username
                    <InputText
                      type="text"
                      name="username"
                      id="username"
                      required
                      value={username}
                      onChange={({ target }) => setUsername(target.value)}
                      placeholder="loish"
                      className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand"
                      pt={{
                        root: {
                          className:
                            'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal',
                        },
                      }}
                    />
                  </label>
                </div>

                {/* Email */}

                <label
                  htmlFor="email"
                  className="flex flex-col w-6/12 font-semibold gap-1"
                >
                  Email
                  <InputText
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
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

                {isArtist && (
                  <>
                    {/* IS ARTIST */}
                    {/* Portfolio */}

                    <label
                      htmlFor="portfolio"
                      className="flex flex-col w-6/12 font-semibold gap-1"
                    >
                      Portfolio:
                      <InputText
                        type="url"
                        name="portfolio"
                        id="portfolio"
                        value={portfolio}
                        onChange={({ target }) => setPortfolio(target.value)}
                        placeholder="http://www.portfolio.com"
                        className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none "
                        pt={{
                          root: {
                            className:
                              'text-black font-medium placeholder:text-black/30 placeholder:font-normal portfolio',
                          },
                        }}
                      />
                    </label>

                    {/* new buttons */}
                    <div className="flex items-center gap-4 mt-4">
                      <Button
                        label="Back"
                        severity="secondary"
                        text
                        rounded
                        className="text-grey hover:text-brand-hover hover:bg-brand/0"
                        onClick={previousStep}
                      />
                      {(email.length <= 0 ||
                        password.length <= 0 ||
                        name.length <= 0 ||
                        username.length <= 0) && (
                        <Button
                          label="Continue"
                          rounded
                          className="bg-black-a-5/30 border-black-a-5/0 hover:border-opacity-0 hover:bg-brand-hover"
                          onClick={nextStep}
                          disabled
                        />
                      )}
                      {email.length > 0 &&
                        password.length > 0 &&
                        name.length > 0 &&
                        username.length > 0 && (
                          <Button
                            label="Continue"
                            rounded
                            className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                            onClick={nextStep}
                          />
                        )}
                    </div>
                  </>
                )}
                {!isArtist && (
                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      label="Back"
                      severity="secondary"
                      text
                      rounded
                      className="text-grey hover:text-brand-hover hover:bg-brand/0"
                      onClick={previousStep}
                    />
                    {(email.length <= 0 ||
                      password.length <= 0 ||
                      name.length <= 0 ||
                      username.length <= 0) && (
                      <Button
                        label="Register"
                        rounded
                        disabled
                        className="bg-black-a-5/30 border-black-a-5/0 hover:border-opacity-0 hover:bg-brand-hover"
                      />
                    )}
                    {email.length > 0 &&
                      password.length > 0 &&
                      name.length > 0 &&
                      username.length > 0 && (
                        <Button
                          label="Register"
                          rounded
                          className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                          type="submit"
                        />
                      )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* IS ARTIST */}
          {isArtist && step === 3 && (
            <>
              <h1 className="text-2xl font-semibold hidden">
                Sign up to illlu
              </h1>
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-semibold">
                  We are here to help you price your art
                </h2>
                <p className="mb-2 text-sm text-black-a-5 ">
                  Our mission is to help you price your work
                </p>
              </div>
              <div className="w-full flex flex-col items-center gap-4">
                <p className="mb-2 text-md text-black p-4 border-l-8 rounded-md border-brand-hover bg-brand-hover/10 flex flex-col gap-1 w-10/12">
                  <span className="text-brand flex gap-2 items-center">
                    <i className="pi pi-info-circle font-semibold" />
                    <b>Info</b>
                  </span>
                  <span>
                    We recommend a minimum hourly rate of <b>{avgSalary}€</b>.
                    This rate is calculated from the monthly average base salary
                    of workers in the arts, entertainment, sports and recreation
                    activities sector in Portugal in 2021
                  </span>
                </p>
                {/* Rate */}

                <label
                  htmlFor="rate"
                  className="flex flex-col w-6/12 font-semibold gap-1"
                >
                  Hourly rate
                  <InputNumber
                    name="rate"
                    id="rate"
                    required
                    value={rate}
                    onChange={e => {
                      setRate(e.value);
                    }}
                    placeholder={avgSalary + '€'}
                    // showButtons
                    min={1}
                    // className="text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand"
                    // pt={{
                    //   input: {
                    //     className:
                    //       'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand',
                    //   },
                    //   // root: {
                    //   //   className:
                    //   //     'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand',
                    //   // },
                    //   incrementButton: {
                    //     className: 'bg-brand border-brand',
                    //   },
                    //   decrementButton: {
                    //     className: 'bg-brand border-brand',
                    //   },
                    // }}
                  />
                </label>

                {/* SUBMIT */}
                <div className="flex items-center gap-4 mt-4">
                  <Button
                    label="Back"
                    severity="secondary"
                    text
                    rounded
                    className="text-grey hover:text-brand-hover hover:bg-brand/0"
                    onClick={previousStep}
                  />
                  {(rate === null || rate === 0) && (
                    <Button
                      label="Register"
                      rounded
                      className="bg-black-a-5/30 border-black-a-5/0 hover:border-opacity-0 hover:bg-brand-hover"
                      disabled
                    />
                  )}
                  {rate && (
                    <Button
                      label="Register"
                      rounded
                      className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                      type="submit"
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {error && <ErrorMessage error={error} className="w-6/12" />}
        </form>
      </div>
    </main>
  );
}

export default SignUp;
