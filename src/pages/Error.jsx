import errorImage from '../assets/error.svg';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

function Error() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-accent-light/50 to-white gap-8">
      <img src={errorImage} alt="" className="w-2/12" />
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-4xl font-semibold text-center">
          Oops! Looks like this page hasn't been drawn yet!
        </h1>
        <p>We could not find the page you're looking for.</p>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/">
          <Button
            label="Go back home"
            severity="secondary"
            text
            rounded
            className="hover:text-brand-hover hover:bg-brand/0"
          />
        </Link>
        <Link to="/explore">
          <Button
            label="Explore illustrations"
            rounded
            className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
          />
        </Link>
      </div>
    </main>
  );
}

export default Error;
