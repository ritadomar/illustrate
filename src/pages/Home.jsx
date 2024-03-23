import { getAllArtworks } from '../api/artwork.api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { Button } from 'primereact/button';

function Home() {
  const [artworks, setArtworks] = useState([]);

  const getArtworks = async () => {
    try {
      const response = await getAllArtworks();
      setArtworks(response.data.slice(0, 16));
    } catch (error) {
      console.log();
    }
  };

  useEffect(() => {
    getArtworks();
  }, []);

  return (
    <main>
      <section className="hero flex flex-col items-center justify-center gap-8 px-10">
        <h1 className="text-7xl font-semibold text-center">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'Find',
              3000, // wait 1s before replacing "Mice" with "Hamsters"
              'Create',
              3000,
              'Commission',
              3000,
              'Explore',
              3000,
              'Sell',
              3000,
            ]}
            wrapper="span"
            speed={25}
            cursor={false}
            // omitDeletionAnimation={true}
            // style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={Infinity}
          />{' '}
          Illustrations
        </h1>
        <p className="text-2xl text-center">
          Say hello to fair pay and stunning results - for everyone!
        </p>
        <Link to="/signup">
          <Button
            label="Get started"
            rounded
            className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
          />
        </Link>
      </section>
      <section className="flex flex-col items-center gap-10 px-10 mb-20">
        <h2 className="text-4xl w-full">Explore illustrations</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 w-full">
          {artworks.map(artwork => {
            return (
              <Link
                to={`/${artwork.artist.username}/artwork/${artwork._id}`}
                key={artwork._id}
                className="hover:text-brand"
              >
                <article className="artwork flex flex-col gap-2">
                  <div
                    style={{
                      '--image-url': `url(${artwork.artworkUrl})`,
                    }}
                    className="bg-[image:var(--image-url)]  bg-no-repeat bg-cover aspect-square rounded"
                  >
                    <div className="flex p-4 items-end w-full h-full hover:bg-gradient-to-t from-black-a-5 artwork-overlay rounded">
                      <h3 className="text-lg artwork-title">{artwork.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <img
                      src={artwork.artist.avatarUrl}
                      alt=""
                      className="aspect-square object-cover rounded-full w-6 h-6 border-2 border-brand"
                    />
                    <p>{artwork.artist.username}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        <Link to={'/signup'}>
          <Button
            label="Explore illustrations"
            rounded
            severity="secondary"
            outlined
            className=" border-brand border-2 text-brand hover:text-brand-hover hover:border-brand-hover hover:bg-brand/0"
          />
        </Link>
      </section>
      <section className="hire flex flex-col items-center justify-center gap-8 bg-brand/20 px-36">
        <h2 className="text-6xl font-semibold text-center">
          Find the perfect illustrator on illlu!
        </h2>
        <p className="text-xl text-center">
          At illlu we're committed to supporting artists and paying them fairly.
          <br />
          Turn your creative ideas into stunning illustrations. Sign up and
          connect with talented artists in minutes.
        </p>
        <Link to="/signup">
          <Button
            label="Get started now"
            rounded
            className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
          />
        </Link>
      </section>
    </main>
  );
}

export default Home;
