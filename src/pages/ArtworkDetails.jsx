import { useState, useEffect, useContext } from 'react';
import { getArtwork, deleteArtwork } from '../api/artwork.api';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import commissionImg from '../assets/commission.svg';
import timeImg from '../assets/time.svg';
import { Image } from 'primereact/image';
import { CurrencyContext } from '../context/currency.context';
import ReadMoreArea from '@foxeian/react-read-more';

function ArtworkDetails() {
  const [artwork, setArtwork] = useState(null);
  const [commissionCover, setCommissionCover] = useState([]);

  const { user } = useContext(AuthContext);
  const { currency, currencySymbol } = useContext(CurrencyContext);

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
          {user && user.username === username && (
            <div className="flex flex-col p-4 gap-4 absolute top-1/3 right-6">
              <Link
                to={`/${artwork.artist.username}/artwork/${artworkId}/edit`}
              >
                <Button
                  icon="pi pi-pencil"
                  rounded
                  outlined
                  severity="secondary"
                  aria-label="Edit"
                  tooltip="Edit"
                  tooltipOptions={{ position: 'left' }}
                  className="border-black text-black font-bold"
                />
              </Link>
              <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                aria-label="Delete"
                tooltip="Delete"
                tooltipOptions={{ position: 'left' }}
                onClick={handleDelete}
              />
            </div>
          )}
          <main className="grid grid-cols-12 pt-24 pl-10 pr-32 gap-4">
            <div className="col-span-5">
              <Image
                src={artwork.artworkUrl}
                className="rounded w-full"
                imageClassName="w-full"
                alt={artwork.title}
                preview
                pt={{
                  preview: {
                    className: 'bg-white',
                  },
                }}
              />
            </div>
            <div className="flex flex-col col-span-7 gap-8 top-20 h-1/2">
              <div className="flex flex-col gap-2">
                <h1 className="text-6xl font-semibold">{artwork.title}</h1>
                <Link
                  to={`/${artwork.artist.username}`}
                  className="hover:text-brand flex items-center gap-2"
                >
                  {artwork.artist.avatarUrl && (
                    <Avatar
                      image={artwork.artist.avatarUrl}
                      size="medium"
                      shape="circle"
                      className="object-cover border-2 border-brand"
                    />
                  )}
                  {!artwork.artist.avatarUrl && (
                    <Avatar
                      label={artwork.artist.username[0].toUpperCase()}
                      size="medium"
                      shape="circle"
                      className="object-cover border-2 border-brand"
                    />
                  )}
                  <p>{artwork.artist.username}</p>
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                <ReadMoreArea
                  wordsLimit={700}
                  buttonClassName="hover:!text-brand-hover !no-underline"
                  buttonStyle={{ color: '#CC205C' }}
                >
                  {artwork.description}
                </ReadMoreArea>
                <div className="flex flex-wrap gap-2 ">
                  {artwork.tags.map(tag => {
                    return (
                      <span
                        key={tag._id}
                        className="italic font-semibold text-accent-strong hover:text-accent-dark"
                      >
                        #{tag.tagName}
                      </span>
                    );
                  })}
                </div>
              </div>
              {/* <p>{artwork.cost}€</p> */}
              <section>
                <h2 className="text-2xl">Commissions:</h2>
                <div className="grid grid-cols-2 gap-2">
                  {artwork.commissions.length <= 0 && (
                    <>
                      {!user ||
                        (user && user.username !== username && (
                          <>
                            <div className="flex flex-col gap-4 items-center justify-center col-span-1 p-8 bg-white border-2 border-accent-light border-dashed rounded h-72">
                              <img src={timeImg} alt="" className="w-1/4" />

                              <p className="text-sm text-gray text-center">
                                This artwork is not associated with any
                                commission yet!
                              </p>
                            </div>
                            <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                          </>
                        ))}
                      {user && user.username === username && (
                        <>
                          <div className="flex flex-col gap-4 items-center justify-center col-span-1 p-8 bg-white border-2 border-accent-light border-dashed rounded h-72">
                            <img src={commissionImg} alt="" className="w-1/4" />
                            <div className="flex flex-col gap-2 items-center justify-center">
                              {/* <h3 className="text-center font-semibold text-lg">
                                
                              </h3> */}
                              <p className="text-sm text-gray text-center">
                                This artwork is not part of a commission yet!
                              </p>
                            </div>
                            <Link to="/newCommission">
                              <Button
                                size="small"
                                label="Create commission"
                                rounded
                                className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                              />
                            </Link>
                          </div>
                          <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                        </>
                      )}
                    </>
                  )}

                  {artwork.commissions.length > 0 && commissionCover && (
                    <>
                      {artwork.commissions.map((commission, index) => {
                        return (
                          <>
                            <Link
                              key={commission._id}
                              to={`/${artwork.artist.username}/commission/${commission._id}`}
                            >
                              <article className="flex flex-col gap-2 items-start col-span-1 bg-white h-72">
                                <img
                                  src={commissionCover[index]}
                                  alt=""
                                  className="w-full h-3/4 object-cover object-top rounded"
                                />
                                <div className="flex flex-col gap-0 items-start">
                                  <h3 className="text-left text-lg">
                                    {commission.title}
                                  </h3>
                                  <p className="text-md text-black font-semibold text-left">
                                    <span className="font-normal">From</span>{' '}
                                    {currencySymbol}
                                    {Math.round(
                                      commission.cost * currency.exchangeRate
                                    )}
                                  </p>
                                </div>
                              </article>
                            </Link>
                          </>
                        );
                      })}
                    </>
                  )}
                </div>
              </section>
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default ArtworkDetails;
