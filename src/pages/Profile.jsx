import { getProfile } from '../api/profiles.api';
import { getArtwork } from '../api/artwork.api';
import { useState, useEffect, useContext } from 'react';
// import { useState, useEffect } from 'react';
import { AuthContext } from '../context/auth.context';
import { StyleContext } from '../context/style.context';
import { Link, useParams } from 'react-router-dom';
import { CurrencyContext } from '../context/currency.context';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';

import timeImg from '../assets/time.svg';
import uploadImg from '../assets/upload.svg';

import { Button } from 'primereact/button';

function Profile() {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const { currency, currencySymbol } = useContext(CurrencyContext);
  const [commissionCover, setCommissionCover] = useState([]);

  const { user, isLoggedIn } = useContext(AuthContext);
  const { setNavTheme } = useContext(StyleContext);

  const getUserProfile = async () => {
    try {
      const response = await getProfile(username);
      setUserProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const populateCommissionCover = async () => {
    try {
      if (userProfile && userProfile.isArtist) {
        const commissionImages = userProfile.commissions.map(commission => {
          const cover = getArtwork(commission.exampleArtwork[0]);
          return cover;
        });

        const response = await Promise.all(commissionImages);

        const covers = response.map(cover => {
          return cover.data.artworkUrl;
        });
        setCommissionCover(covers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [username]);

  useEffect(() => {
    setNavTheme('dark');
    return () => setNavTheme('light');
  }, []);

  useEffect(() => {
    populateCommissionCover();
  }, [userProfile]);

  return (
    <>
      {userProfile && (
        <header className="flex flex-col items-center justify-end h-[63vh]">
          {userProfile.artwork.length <= 0 && (
            <div className="w-full h-[40vh] -z-10 top-0 bg-gradient-to-b from-black-a-5 to-black-a-5/0 absolute"></div>
          )}

          {userProfile.isArtist && userProfile.artwork.length > 0 && (
            <div
              style={{
                '--image-url': `url(${
                  userProfile.artwork[
                    Math.round(Math.random() * (userProfile.artwork.length - 1))
                  ].artworkUrl
                })`,
                backgroundPosition: 'center top 35%',
              }}
              className="absolute w-full h-[40vh] -z-10 top-0 bg-cover bg-[image:var(--image-url)]"
            >
              <div className="bg-gradient-to-b from-black-a-5 to-black-a-5/0 absolute w-full h-full" />
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            {userProfile.avatarUrl && (
              <Avatar
                image={userProfile.avatarUrl}
                shape="circle"
                className="object-cover border-[6px] border-white w-28 h-28"
              />
            )}
            {!userProfile.avatarUrl && (
              <Avatar
                label={userProfile.username[0].toUpperCase()}
                shape="circle"
                className="object-cover border-[6px] border-white w-28 h-28 text-6xl text-brand"
              />
            )}
            <div className="flex flex-col gap-0 items-center">
              <div className="flex gap-2 items-center">
                <h1 className="text-2xl font-semibold flex flex-col items-center">
                  {userProfile.name}
                </h1>
                {userProfile.isArtist && (
                  <Tag
                    value="artist"
                    rounded
                    className='font-["work-sans"] bg-brand-hover font-semibold'
                  ></Tag>
                )}
              </div>
              <p className="text-brand font-normal text-lg">@{username}</p>
            </div>
            <div className="flex gap-2 items-center mt-1">
              {userProfile.isArtist && userProfile.portfolio.length > 0 && (
                <a href={userProfile.portfolio}>
                  <Button
                    icon="pi pi-images"
                    label="Portfolio"
                    rounded
                    size="small"
                    className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover profile-button"
                  />
                </a>
              )}
              {isLoggedIn && (
                <a href={`mailto:${userProfile.email}`}>
                  <Button
                    icon="pi pi-envelope"
                    label="Get it touch"
                    rounded
                    size="small"
                    severity="secondary"
                    outlined
                    className=" border-brand border-2 text-brand hover:text-brand-hover hover:border-brand-hover hover:bg-brand/0 profile-button"
                  />
                </a>
              )}
            </div>
          </div>
        </header>
      )}
      <main className="pt-24 px-10 flex flex-col gap-6">
        {userProfile && (
          <>
            {userProfile && userProfile.isArtist && (
              <>
                {/* COMMISSIONS */}
                <section className="flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold">Commissions</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {userProfile.commissions.length <= 0 && (
                      <>
                        <div className="flex flex-col gap-4 items-center justify-center col-span-1 p-8 bg-white border-2 border-accent-light border-dashed rounded h-72">
                          <img src={timeImg} alt="" className="w-1/4" />

                          <p className="text-sm text-gray text-center">
                            No commissions yet!
                          </p>
                          {user && user.username === username && (
                            <Link to="/newCommission">
                              <Button
                                size="small"
                                label="Create commission"
                                rounded
                                className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                              />
                            </Link>
                          )}
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                        <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                      </>
                    )}

                    {userProfile.commissions.length > 0 && commissionCover && (
                      <>
                        {userProfile.commissions.map((commission, index) => {
                          return (
                            <Link
                              key={commission._id}
                              to={`/${userProfile.username}/commission/${commission._id}`}
                              className="group cursor-pointer"
                            >
                              <article className="flex flex-col gap-2 items-start col-span-1 bg-white h-72">
                                <img
                                  src={commissionCover[index]}
                                  alt=""
                                  className="w-full h-3/4 object-cover object-top rounded"
                                />
                                <div className="flex flex-col gap-0 items-start">
                                  <h3 className="text-left text-lg group-hover:text-brand-hover">
                                    {commission.title}
                                  </h3>
                                  <p className="text-md text-black font-semibold text-left">
                                    <span className="font-normal">From</span>{' '}
                                    {currencySymbol}
                                    {Math.round(
                                      commission.cost * currency.exchangeRate
                                    )}
                                  </p>
                                </div>
                              </article>
                            </Link>
                          );
                        })}
                      </>
                    )}
                  </div>
                </section>

                {/* ARTWORK */}
                <section className="flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold">Artwork</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {userProfile.artwork.length <= 0 && (
                      <>
                        <div className="flex flex-col gap-4 items-center justify-center col-span-1 p-8 bg-white border-2 border-accent-light border-dashed rounded h-72">
                          <img src={uploadImg} alt="" className="w-1/4" />

                          <p className="text-sm text-gray text-center">
                            No artwork yet!
                          </p>
                          {user && user.username === username && (
                            <Link to="/upload">
                              <Button
                                size="small"
                                label="Upload artwork"
                                rounded
                                className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                              />
                            </Link>
                          )}
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                        <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                        <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                      </>
                    )}
                    {userProfile.artwork &&
                      userProfile.artwork.map(artwork => {
                        return (
                          <Link
                            to={`/${username}/artwork/${artwork._id}`}
                            key={artwork._id}
                            className="hover:text-brand-hover cursor-pointer"
                          >
                            <article className="artwork flex flex-col gap-2 ">
                              <div
                                style={{
                                  '--image-url': `url(${artwork.artworkUrl})`,
                                }}
                                className="bg-[image:var(--image-url)]  bg-no-repeat bg-cover aspect-square rounded  bg-white border-2 border-accent-light"
                              >
                                <div className="flex p-4 items-end w-full h-full hover:bg-gradient-to-t from-black-a-5 artwork-overlay rounded">
                                  <h3 className="text-lg artwork-title">
                                    {artwork.title}
                                  </h3>
                                </div>
                              </div>
                            </article>
                          </Link>
                        );
                      })}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Profile;
