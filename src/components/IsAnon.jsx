import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Navigate } from 'react-router-dom';
import Loading from './Loading';

const IsAnon = props => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  if (isLoggedIn) {
    return <Navigate to={'/'} />;
  } else {
    return props.children;
  }
};

export default IsAnon;
