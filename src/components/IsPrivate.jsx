import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Navigate } from 'react-router-dom';

const IsPrivate = props => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  //   if the authentication is still loading
  if (isLoading) {
    <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    // if the user is not logged in
    return <Navigate to={'/login'} />;
  } else {
    return props.children;
  }
};

export default IsPrivate;
