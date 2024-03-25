import { Link } from 'react-router-dom';

import logo from '../assets/logo-light.svg';

function Footer() {
  return (
    <footer className="Footer  pt-8 gap-16 flex flex-col items-center justify-between">
      {/* home */}
      <div className="flex items-center justify-between w-full px-10">
        <Link to="/" className="h-10">
          {/* change to logo */}
          <img src={logo} alt="illlu logo" className="h-10" />
        </Link>
        <div className="flex gap-8 font-medium">
          <Link to="/explore" className="hover:text-brand-hover">
            Explore
          </Link>
          <Link to="/resources" className="hover:text-brand-hover">
            Resources
          </Link>
        </div>
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/ritadomar/">
            <i
              className="pi pi-linkedin text-black text-lg hover:text-brand-hover"
              alt=""
            />
          </a>
          <a href="https://github.com/ritadomar/illustrate">
            <i
              className="pi pi-github text-black text-lg hover:text-brand-hover"
              alt=""
            />
          </a>
          <a href="https://www.instagram.com/ritadomar">
            <i
              className="pi pi-instagram text-black text-lg hover:text-brand-hover"
              alt=""
            />
          </a>
        </div>
      </div>
      <p className="text-sm text-brand-hover/80 py-2 w-full px-1 flex justify-center items-center">
        © 2024 Rita Martins
      </p>
    </footer>
  );
}

export default Footer;
