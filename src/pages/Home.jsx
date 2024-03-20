import { getAllArtworks } from '../api/artwork.api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
      <h1>Home</h1>
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
