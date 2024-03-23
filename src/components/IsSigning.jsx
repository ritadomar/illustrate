import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

const IsSigning = props => {
  const { isSigning } = useContext(AuthContext);

  // //   if the authentication is still loading
  // if (isLoading) {
  //   <p>Loading...</p>;
  // }

  if (!isSigning) {
    return props.children;
  } else {
    return <></>;
  }
};

export default IsSigning;
