import { getAllArtworks } from '../api/artwork.api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

function Home() {
  const [artworks, setArtworks] = useState([]);

  const getArtworks = async () => {
    try {
      const response = await getAllArtworks();
      setArtworks(response.data);
    } catch (error) {
      console.log();
    }
  };

  useEffect(() => {
    getArtworks();
  }, []);

  return (
    <div>
      <h1 className="text-right">
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
          speed={50}
          cursor={false}
          // style={{ fontSize: '2em', display: 'inline-block' }}
          repeat={Infinity}
        />{' '}
        Illustrations
      </h1>
      {/* <h1>Home</h1> */}
      {artworks.map(artwork => {
        return (
          <Link
            to={`/${artwork.artist.username}/artwork/${artwork._id}`}
            key={artwork._id}
          >
            <article className="artwork">
              <img src={artwork.artworkUrl} alt="" width={500} />
              <h2>{artwork.title}</h2>
            </article>
          </Link>
        );
      })}
    </div>
  );
}

export default Home;
