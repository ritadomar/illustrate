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
          {userProfile.artwork.map(artwork => {
            return (
              <Link to={`/${username}/${artwork._id}`} key={artwork._id}>
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
