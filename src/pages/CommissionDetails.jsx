import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { CurrencyContext } from '../context/currency.context';
import { getCommission, deleteCommission } from '../api/commission.api';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Galleria } from 'primereact/galleria';
import { ScrollPanel } from 'primereact/scrollpanel';

function CommissionDetails() {
  const [commission, setCommission] = useState(null);
  const [images, setImages] = useState(null);

  const { user, isLoggedIn } = useContext(AuthContext);

  const { currency, currencySymbol } = useContext(CurrencyContext);

  const { commissionId, username } = useParams();
  const navigate = useNavigate();

  const getSingleCommission = async () => {
    try {
      const response = await getCommission(commissionId);
      setCommission(response.data);
      setImages(response.data.exampleArtwork);
    } catch (error) {
      console.log(error);
    }
  };

  const responsiveOptions = [
    {
      breakpoint: '991px',
      numVisible: 4,
    },
    {
      breakpoint: '767px',
      numVisible: 3,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  const itemTemplate = item => {
    return (
      <img
        src={item.artworkUrl}
        alt={item.title}
        className="w-full h-[70vh] object-contain"
        // style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
      />
    );
  };

  const thumbnailTemplate = item => {
    return (
      <img
        src={item.artworkUrl}
        alt={item.title}
        className="aspect-video object-cover object-center border-2 border-accent-strong rounded w-24"
      />
    );
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
          {user && user.username === username && (
            <div className="flex flex-col p-4 gap-4 absolute top-1/3 right-6">
              <Link
                to={`/${commission.artist.username}/commission/${commissionId}/edit`}
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
            {commission && (
              <Galleria
                value={images}
                responsiveOptions={responsiveOptions}
                numVisible={5}
                // style={{ maxWidth: '640px' }}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
                showItemNavigators
                className="col-span-7 "
                pt={{
                  thumbnailContainer: {
                    className: 'bg-accent-light/20',
                  },
                  itemContainer: {
                    className: 'bg-accent-light/20 pt-4',
                  },
                  previousItemIcon: {
                    className: 'text-accent-strong !w-6',
                  },
                  nextItemIcon: {
                    className: 'text-accent-strong !w-6',
                  },

                  previousThumbnailIcon: {
                    className: 'text-accent-strong',
                  },
                  nextThumbnailIcon: {
                    className: 'text-accent-strong',
                  },
                }}
              />
            )}

            <div className="flex flex-col col-span-5 gap-8 top-20 border-accent-light border-2 rounded">
              <header className="px-4 pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4 items-center">
                    <h1 className="text-6xl font-semibold">
                      {commission.title}
                    </h1>
                    <p>
                      From{' '}
                      <span className="text-2xl text-black font-semibold">
                        {currencySymbol}
                        {Math.round(commission.cost * currency.exchangeRate)}
                      </span>
                    </p>
                  </div>
                  <Link
                    to={`/${commission.artist.username}`}
                    className="hover:text-brand flex items-center gap-2"
                  >
                    {commission.artist.avatarUrl && (
                      <Avatar
                        image={commission.artist.avatarUrl}
                        size="medium"
                        shape="circle"
                        className="object-cover border-2 border-brand"
                      />
                    )}
                    {!commission.artist.avatarUrl && (
                      <Avatar
                        label={commission.artist.username[0].toUpperCase()}
                        size="medium"
                        shape="circle"
                        className="object-cover border-2 border-brand"
                      />
                    )}
                    <p>{commission.artist.username}</p>
                  </Link>
                </div>
              </header>

              <div className="flex flex-col gap-2 flex-grow px-4">
                <h2 className="text-2xl font-semibold">Commission details</h2>
                <ScrollPanel className="w-full flex-grow">
                  <p className="font-['Work-Sans']">{commission.description}</p>
                </ScrollPanel>
              </div>
              <div className="flex flex-wrap gap-2 px-4">
                {commission.tags.map(tag => {
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

              <div className="flex flex-col items-center justify-center gap-4 bg-accent-light p-4">
                {isLoggedIn && (
                  <>
                    <p>Ready to make a commission?</p>
                    <div>
                      <Button
                        label={`Contact ${commission.artist.username}`}
                        rounded
                        className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                      />
                    </div>
                  </>
                )}
                {!isLoggedIn && (
                  <>
                    <p>
                      You need to be registered to start hiring our artists!
                    </p>
                    <div>
                      <Link to="/signup">
                        <Button
                          label="Register now"
                          rounded
                          className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                        />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default CommissionDetails;
