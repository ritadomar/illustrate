import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import ProfileMenu from './ProfileMenu';
import logo from '../assets/logo-illlu.svg';
import { Button } from 'primereact/button';

function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <nav className="Navbar">
      {/* home */}
      <Link to="/">
        {/* change to logo */}
        <img src={logo} alt="illlu logo" />
      </Link>
      <div className="nav-links">
        <Link to="/explore">Explore</Link>
        <Link to="/resources">Resources</Link>
      </div>
      {/* Protect */}
      {!isLoggedIn && (
        <div className="user-links">
          <Link to="/login">
            <Button label="Log In" severity="secondary" text rounded />
          </Link>
          <Link to="/signup">
            <Button label="Sign Up" rounded />
          </Link>
        </div>
      )}
      {isLoggedIn && <ProfileMenu />}
    </nav>
  );
}

export default Navbar;
