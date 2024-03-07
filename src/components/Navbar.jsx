import { Link } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/auth.context';

function Navbar() {
  return (
    <nav>
      <Link to="/">
        {/* change to logo */}
        Home
      </Link>
      <Link to="/explore">Explore</Link>
      <Link to="/resources">Resources</Link>
      {/* Protect */}
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
      <Link to="/login">
        <button>Log In</button>
      </Link>
      <Link to="/:profile">
        {/* Replace with user avatar */}
        Profile
      </Link>
    </nav>
  );
}

export default Navbar;
