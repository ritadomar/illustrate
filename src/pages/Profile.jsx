import { getProfile } from '../api/profiles.api';
// import { useState, useEffect, useContext } from 'react';
import { useState, useEffect } from 'react';
// import { AuthContext } from '../context/auth.context';
import { Link, useParams } from 'react-router-dom';

function Profile() {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  //   const { isLoading } = useContext(AuthContext);

  const getUserProfile = async () => {
    try {
      const response = await getProfile(username);
      setUserProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      {userProfile && (
        <>
          <img src={userProfile.avatarUrl} alt="" width={200} />
          <h2>Commissions</h2>
          {userProfile.isArtist && userProfile.commissions.length < 0 && (
            <p>No commissions yet</p>
          )}
          {userProfile.commissions &&
            userProfile.commissions.map(commission => {
              return (
                <Link
                  to={`/${username}/commission/${commission._id}`}
                  key={commission._id}
                >
                  <article>
                    <img
                      src={
                        userProfile.artwork.find(
                          artwork =>
                            artwork._id === commission.exampleArtwork[0]
                        ).artworkUrl
                      }
                      alt=""
                      width={500}
                    />
                    <h2>{commission.title}</h2>
                    <p>From: {commission.cost}€</p>
                  </article>
                </Link>
              );
            })}
          <h2>Portfolio</h2>
          {userProfile.isArtist && userProfile.artwork.length < 0 && (
            <p>No artwork uploaded yet</p>
          )}
          {userProfile.artwork &&
            userProfile.artwork.map(artwork => {
              return (
                <Link
                  to={`/${username}/artwork/${artwork._id}`}
                  key={artwork._id}
                >
                  <article>
                    <img src={artwork.artworkUrl} alt="" width={500} />
                    <h2>{artwork.title}</h2>
                  </article>
                </Link>
              );
            })}
        </>
      )}
    </>
  );
}

export default Profile;
