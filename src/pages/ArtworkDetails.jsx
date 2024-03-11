import { useState, useEffect, useContext } from 'react';
import { getArtwork, deleteArtwork } from '../api/artwork.api';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

function ArtworkDetails() {
  const [artwork, setArtwork] = useState(null);

  const { user } = useContext(AuthContext);

  const { artworkId, username } = useParams();
  const navigate = useNavigate();

  const getSingleArtwork = async () => {
    const response = await getArtwork(artworkId);
    setArtwork(response.data);
  };

  const handleDelete = async () => {
    await deleteArtwork(artworkId);
    console.log(artwork.artist.username);
    navigate(`/${artwork.artist.username}`);
  };

  useEffect(() => {
    getSingleArtwork();
  }, []);

  return (
    <>
      {artwork && (
        <>
          <header>
            <h1>{artwork.title}</h1>
            <div>
              {user && user.username === username && (
                <>
                  <button onClick={handleDelete}>Delete Artwork</button>
                  <Link to={`/${artwork.artist.username}/${artworkId}/edit`}>
                    <button>Edit Artwork</button>
                  </Link>
                </>
              )}
            </div>
          </header>
          <main>
            <img src={artwork.artworkUrl} alt="" width={500} />
            <p>{artwork.description}</p>
            {artwork.tags.map(tag => {
              return <span key={tag._id}>{tag.tagName}</span>;
            })}
            <p>{artwork.cost}€</p>
          </main>
        </>
      )}
    </>
  );
}

export default ArtworkDetails;
