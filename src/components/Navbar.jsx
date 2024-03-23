import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import ProfileMenu from './ProfileMenu';
import logo from '../assets/logo-illlu.svg';
import { Button } from 'primereact/button';
import IsSigning from './IsSigning';

function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <nav className="Navbar px-10 py-4 absolute w-full h-20">
      {/* home */}
      <Link to="/">
        {/* change to logo */}
        <img src={logo} alt="illlu logo" />
      </Link>
      <IsSigning>
        <div className="nav-links font-medium">
          <Link to="/explore" className="hover:text-brand">
            Explore
          </Link>
          <Link to="/resources" className="hover:text-brand">
            Resources
          </Link>
        </div>
        {/* Protect */}
        {!isLoggedIn && (
          <div className="user-links">
            <Link to="/login">
              <Button
                label="Log In"
                severity="secondary"
                text
                rounded
                className="hover:text-brand-hover hover:bg-brand/0"
              />
            </Link>
            <Link to="/signup">
              <Button
                label="Sign Up"
                rounded
                className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
              />
            </Link>
          </div>
        )}
        {isLoggedIn && <ProfileMenu />}
      </IsSigning>
    </nav>
  );
}

export default Navbar;
