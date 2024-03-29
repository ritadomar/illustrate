import { useState, useEffect, useContext } from 'react';
import { getProfile, updateProfile, deleteProfile } from '../api/profiles.api';
import { upload } from '../api/upload.api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { Button } from 'primereact/button';
import artistsImage from '../assets/oc-growing.svg';
import buyersImage from '../assets/oc-hi-five.svg';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import ErrorMessage from '../components/ErrorMessage';

function EditProfile() {
  const { isSigning, setIsSigning, logOutUser } = useContext(AuthContext);
  const { username } = useParams();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isArtist, setIsArtist] = useState(null);
  const [portfolio, setPortfolio] = useState('');
  const [rate, setRate] = useState('');
  const [avatar, setAvatar] = useState();
  const [error, setError] = useState(null);
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

  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/${username}`);
  };

  const getSingleProfile = async () => {
    try {
      const response = await getProfile(username);
      setEmail(response.data.email);
      setName(response.data.name);
      setIsArtist(response.data.isArtist);
      setPortfolio(response.data.portfolio);
      setRate(response.data.rate);
      if (response.data.avatarUrl) {
        setAvatarUrl(response.data.avatarUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProfile();
    calcAvgSalary();
  }, []);

  const handleRole = e => {
    console.log(e.target.value);
    e.target.value === 'true' ? setIsArtist(true) : setIsArtist(false);
  };

  const handleAvatar = ({ target }) => {
    console.log(target.files[0]);
    setAvatar(target.files[0]);
    setAvatarUrl(URL.createObjectURL(target.files[0]));
  };

  const handleDelete = async () => {
    try {
      await deleteProfile(username);
      logOutUser();
      navigate(`/`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const user = {
      email,
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

      if (!avatar && avatarUrl) {
        user.avatarUrl = avatarUrl;
      }

      await updateProfile(user);
      navigate(`/${username}`);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <main className=" h-dvh mx-10 py-24">
      <h1 className="absolute inset-x-0 top-6 text-2xl font-bold text-center text-black -z-10">
        Edit Profile
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-12 h-full">
        <div className="col-span-6 h-screen">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-semibold mb-2">Change your account type</h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                <label className="col-span-1 p-4 border-accent-light border-2 rounded-lg flex flex-col items-end gap-4 has-[:checked]:bg-accent-light/50 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0">
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
                  <span className="w-full text-md">I'm an artist </span>
                </label>
                <label className="col-span-1 p-4 border-accent-light border-2 rounded-lg flex flex-col items-end gap-4 has-[:checked]:bg-accent-light/50 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0">
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
                  <span className="w-full text-md">I'm a client</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6 h-[80vh] flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center gap-4">
            <h2 className="font-semibold mb-2 w-full">Edit details</h2>
            {/* Avatar */}
            {!avatarUrl && (
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
            {avatarUrl && (
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

            <div className="grid grid-cols-2 w-full gap-4">
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

              {/* editUsername */}
              <label
                htmlFor="username"
                className="flex flex-col font-semibold gap-1"
              >
                Username
                <InputText
                  type="text"
                  name="username"
                  id="username"
                  disabled
                  value={username}
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
              className="flex flex-col w-full font-semibold gap-1"
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

            {isArtist && (
              <>
                {/* Portfolio */}
                <label
                  htmlFor="portfolio"
                  className="flex flex-col w-full font-semibold gap-1"
                >
                  Portfolio
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
                <label
                  htmlFor="rate"
                  className="flex flex-col w-full font-semibold gap-1"
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
                  />
                </label>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Button
              label="Cancel"
              severity="secondary"
              text
              rounded
              className="text-grey hover:text-brand-hover hover:bg-brand/0"
              onClick={goBack}
            />
            <Button
              label="Save Changes"
              rounded
              className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
              type="submit"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 absolute top-0 right-10">
          <Button
            label="Delete Account"
            severity="danger"
            rounded
            onClick={handleDelete}
            // className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
            type="submit"
          />
        </div>
        {error && <ErrorMessage error={error} className="w-6/12" />}
      </form>
    </main>
  );
}

export default EditProfile;
