import { getAllArtworks } from '../api/artwork.api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { DeferredContent } from 'primereact/deferredcontent';
import Loading from '../components/Loading';

function Home() {
  const [artworks, setArtworks] = useState(null);

  const getArtworks = async () => {
    try {
      const response = await getAllArtworks();
      setArtworks(response.data.reverse().slice(0, 16));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtworks();
  }, []);

  return (
    <main className="bg-gradient-to-b from-accent-light/50 to-white">
      <section className="hero flex flex-col items-center justify-center gap-8 px-10 pt-10">
        <h1 className="text-8xl  text-center font-display text-brand-darkest">
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
          />
          <br />
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
          {!artworks && <Loading props="home" />}
          {artworks &&
            artworks.map(artwork => {
              return (
                <DeferredContent key={artwork._id}>
                  <article className="artwork flex flex-col gap-2 ">
                    <Link
                      to={`/${artwork.artist.username}/artwork/${artwork._id}`}
                      className="hover:text-brand-hover cursor-pointer"
                    >
                      <div
                        style={{
                          '--image-url': `url(${artwork.artworkUrl})`,
                        }}
                        className="bg-[image:var(--image-url)]  bg-no-repeat bg-cover aspect-square rounded  bg-white border-2 border-accent-light"
                      >
                        <div className="flex p-4 items-end w-full h-full hover:bg-gradient-to-t from-black-a-5 artwork-overlay rounded">
                          <h3 className="text-lg artwork-title">
                            {artwork.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={`/${artwork.artist.username}/`}
                      className="hover:text-brand-hover cursor-pointer z-10"
                    >
                      <div className="flex items-center gap-1">
                        {artwork.artist.avatarUrl && (
                          <Avatar
                            image={artwork.artist.avatarUrl}
                            size="small"
                            shape="circle"
                            className="object-cover border-2 border-brand w-8 h-8 ml-1"
                          />
                        )}
                        {!artwork.artist.avatarUrl && (
                          <Avatar
                            label={artwork.artist.username[0].toUpperCase()}
                            size="small"
                            shape="circle"
                            className="object-cover border-2 border-brand w-8 h-8 ml-1"
                          />
                        )}
                        <p>{artwork.artist.username}</p>
                        {artwork.artist.avgRating > 0 && (
                          <>
                            <span>|</span>{' '}
                            <span className="flex items-center gap-1  text-brand font-semibold">
                              <span className="pi pi-star-fill"></span>
                              <p>
                                {Math.round(artwork.artist.avgRating * 10) / 10}
                              </p>
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  </article>
                </DeferredContent>
              );
            })}
        </div>
        <Link to={'/explore'}>
          <Button
            label="Explore illustrations"
            rounded
            severity="secondary"
            outlined
            className=" border-brand border-2 text-brand hover:text-brand-hover hover:border-brand-hover hover:bg-brand/0"
          />
        </Link>
      </section>
      <section className="hire flex flex-col items-center justify-center gap-8 bg-accent px-20 pt-10">
        <h2 className="text-6xl font-semibold text-center font-display w-1/2">
          Find the perfect illustrator on illlu!
        </h2>
        <p className="text-xl text-center w-1/2">
          We're committed to supporting artists!
          <br />
          Turn your creative ideas into stunning illustrations. Sign up and
          connect with talented artists in minutes.
        </p>
        <Link to="/signup">
          <Button
            label="Get started now"
            rounded
            className="bg-white border-white hover:text-gray-darker text-black text-md"
          />
        </Link>
      </section>
    </main>
  );
}

export default Home;
