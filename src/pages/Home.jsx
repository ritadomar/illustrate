import { getAllArtworks } from '../api/artwork.api';
import { useEffect, useState } from 'react';

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
          <article key={artwork._id}>
            <h2>{artwork.title}</h2>
            <img src={artwork.artworkUrl} alt="" width={100} />
          </article>
        );
      })}
    </div>
  );
}

export default Home;
