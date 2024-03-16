import { useState, useEffect, useContext } from 'react';
import { getArtwork, deleteArtwork } from '../api/artwork.api';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

function ArtworkDetails() {
  const [artwork, setArtwork] = useState(null);
  const [commissionCover, setCommissionCover] = useState([]);

  const { user } = useContext(AuthContext);

  const { artworkId, username } = useParams();
  const navigate = useNavigate();

  const getSingleArtwork = async () => {
    try {
      const response = await getArtwork(artworkId);
      setArtwork(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const populateCommissionCover = async () => {
    try {
      if (artwork) {
        const commissionImages = artwork.commissions.map(commission => {
          const cover = getArtwork(commission.exampleArtwork[0]);
          return cover;
        });

        const response = await Promise.all(commissionImages);

        const covers = response.map(cover => {
          return cover.data.artworkUrl;
        });
        setCommissionCover(covers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArtwork(artworkId);
      navigate(`/${artwork.artist.username}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleArtwork();
  }, []);

  useEffect(() => {
    populateCommissionCover();
  }, [artwork]);

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
                  <Link
                    to={`/${artwork.artist.username}/artwork/${artworkId}/edit`}
                  >
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
            {artwork.commissions.length > 0 && commissionCover && (
              <>
                <h2>Commissions:</h2>
                {artwork.commissions.map((commission, index) => {
                  return (
                    <Link
                      key={commission._id}
                      to={`/${artwork.artist.username}/commission/${commission._id}`}
                    >
                      <article>
                        <img src={commissionCover[index]} alt="" width={300} />
                        <h3>{commission.title}</h3>
                        <p>From: {commission.cost}€</p>
                      </article>
                    </Link>
                  );
                })}
              </>
            )}
          </main>
        </>
      )}
    </>
  );
}

export default ArtworkDetails;
