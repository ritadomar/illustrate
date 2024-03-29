import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Navigate, useParams } from 'react-router-dom';
import Loading from './Loading';

const IsForArtists = props => {
  const { user, isLoading } = useContext(AuthContext);
  const { username } = useParams();

  //   if the authentication is still loading
  if (isLoading) {
    <Loading />;
  }

  if (!user.isArtist || (username && username !== user.username)) {
    // if the user is not an artist in
    return <Navigate to={`/`} />;
  } else {
    return props.children;
  }
};

export default IsForArtists;
