import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { StyleContext } from '../context/style.context';
import ProfileMenu from './ProfileMenu';
import logo from '../assets/logo-light.svg';
import logoWhite from '../assets/logo-white.svg';
import { Button } from 'primereact/button';
import IsSigning from './IsSigning';
import CurrencyDropdown from './CurrencyDropdown';

function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);
  const { navTheme } = useContext(StyleContext);

  return (
    <nav className={`Navbar px-10 py-4 absolute w-full h-20 ${navTheme}`}>
      {/* home */}
      <Link to="/" className="h-full z-10">
        {/* change to logo */}
        {navTheme === 'light' && (
          <img src={logo} alt="illlu logo" className="h-full" />
        )}
        {navTheme === 'dark' && (
          <img src={logoWhite} alt="illlu logo" className="h-full" />
        )}
      </Link>
      <IsSigning>
        <div className="absolute inset-x-0 top-7 nav-links font-medium">
          <Link to="/explore" className="hover:text-brand-hover">
            Explore
          </Link>
          <Link to="/resources" className="hover:text-brand-hover">
            Resources
          </Link>
        </div>
        {/* Protect */}
        <div className="flex gap-2 items-center justify-end z-10">
          <CurrencyDropdown />
          {!isLoggedIn && (
            <div className="user-links">
              <Link to="/login">
                <Button
                  label="Log In"
                  severity="secondary"
                  text
                  rounded
                  className="hover:text-brand-hover hover:bg-brand/0 text-grey"
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
        </div>
      </IsSigning>
    </nav>
  );
}

export default Navbar;
