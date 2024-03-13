import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Navigate, useParams } from 'react-router-dom';

const IsForArtists = props => {
  const { user, isLoading } = useContext(AuthContext);
  const { username } = useParams();

  //   if the authentication is still loading
  if (isLoading) {
    <p>Loading...</p>;
  }

  if (!user.isArtist || (username && username !== user.username)) {
    // if the user is not an artist in
    return <Navigate to={`/`} />;
  } else {
    return props.children;
  }
};

export default IsForArtists;
