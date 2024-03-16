import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { getCommission, deleteCommission } from '../api/commission.api';

function CommissionDetails() {
  const [commission, setCommission] = useState(null);

  const { user } = useContext(AuthContext);

  const { commissionId, username } = useParams();
  const navigate = useNavigate();

  const getSingleCommission = async () => {
    try {
      const response = await getCommission(commissionId);
      setCommission(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //   const populateCommissionCover = async () => {
  //     try {
  //       if (artwork) {
  //         const commissionImages = artwork.commissions.map(commission => {
  //           const cover = getArtwork(commission.exampleArtwork[0]);
  //           return cover;
  //         });

  //         const response = await Promise.all(commissionImages);

  //         const covers = response.map(cover => {
  //           return cover.data.artworkUrl;
  //         });
  //         console.log('covers', covers);
  //         setCommissionCover(covers);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const handleDelete = async () => {
    try {
      await deleteCommission(commissionId);
      navigate(`/${commission.artist.username}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleCommission();
  }, []);

  return (
    <>
      {commission && (
        <>
          <header>
            <h1>{commission.title}</h1>
            <div>
              {user && user.username === username && (
                <>
                  <button onClick={handleDelete}>Delete Commission</button>
                  <Link
                    to={`/${commission.artist.username}/commission/${commissionId}/edit`}
                  >
                    <button>Edit Commission</button>
                  </Link>
                </>
              )}
            </div>
          </header>
          <main>
            {commission &&
              commission.exampleArtwork.map(artwork => {
                return (
                  <img
                    src={artwork.artworkUrl}
                    alt=""
                    key={artwork._id}
                    width={200}
                  />
                );
              })}
            <p>{commission.description}</p>
            {commission.tags.map(tag => {
              return <span key={tag._id}>{tag.tagName}</span>;
            })}
            <p>Starting at: {commission.cost}€</p>
          </main>
        </>
      )}
    </>
  );
}

export default CommissionDetails;
