import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

function Navbar() {
  const { isLoggedIn, logOutUser, user } = useContext(AuthContext);
  return (
    <nav className="Navbar">
      {/* home */}
      <Link to="/">
        {/* change to logo */}
        Home
      </Link>
      <div className="nav-links">
        <Link to="/explore">Explore</Link>
        <Link to="/resources">Resources</Link>
      </div>
      {/* Protect */}
      {!isLoggedIn && (
        <div className="user-links">
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
          <Link to="/login">
            <button>Log In</button>
          </Link>
        </div>
      )}
      {isLoggedIn && (
        <div className="user-links">
          <Link onClick={logOutUser}>Log Out</Link>
          {user.isArtist && (
            <>
              <Link to="/upload">Upload Art</Link>
              <Link to="/newCommission">Create Commission</Link>
            </>
          )}
          <Link to={`/${user.username}`}>
            <img src={user.avatarUrl} alt="" className="nopin" />
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
