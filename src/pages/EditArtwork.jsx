import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateArtwork, getArtwork } from '../api/artwork.api';
import { getCommission } from '../api/commission.api';
import { upload } from '../api/upload.api';
import InputTag from '../components/InputTag';
import uploadImg from '../assets/upload.svg';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Tooltip } from 'primereact/tooltip';
import ErrorMessage from '../components/ErrorMessage';

function EditArtwork() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artwork, setArtwork] = useState(null);
  const [inputTags, setInputTags] = useState([]);
  const [time, setTime] = useState('');
  const [cost, setCost] = useState(0);
  const [commissions, setCommissions] = useState([]);
  const [displayArtwork, setDisplayArtwork] = useState('');
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);

  // to display commissions list
  const [commissionsList, setCommissionsList] = useState(null);

  // controlling dynamic checkbox
  const [selectedCommissions, setSelectedCommissions] = useState([]);

  const { artworkId, username } = useParams();

  const navigate = useNavigate();

  const getSingleArtwork = async () => {
    try {
      const response = await getArtwork(artworkId);
      setTitle(response.data.title);
      setDescription(response.data.description);
      const tags = response.data.tags.map(tag => {
        return { id: tag._id, text: tag.tagName };
      });
      setInputTags(tags);
      setTime(response.data.time);
      setCost(response.data.cost);
      setCommissions(response.data.commissions);
      setDisplayArtwork(response.data.artworkUrl);
      setArtist(response.data.artist);

      const checkedCommissions = response.data.commissions.map(commission => {
        return commission._id;
      });
      setSelectedCommissions(checkedCommissions);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommissions = async () => {
    try {
      if (artist && artist.commissions.length > 0) {
        const commissionsList = artist.commissions.map(commission => {
          const details = getCommission(commission);
          return details;
        });
        const response = await Promise.all(commissionsList);
        const responseData = response.map(response => {
          return response.data;
        });
        setCommissionsList(responseData);
      }
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleArtwork();
  }, []);

  useEffect(() => {
    getCommissions();
  }, [artwork, commissions]);

  const handleArtwork = ({ target }) => {
    setArtwork(target.files[0]);
    setDisplayArtwork(URL.createObjectURL(target.files[0]));
  };

  const handleCost = time => {
    setCost(time * artist.rate);
  };

  const handleCheck = e => {
    const checkedId = e.target.value;
    if (e.target.checked) {
      const updatedCommissions = [...selectedCommissions, checkedId];
      setSelectedCommissions(updatedCommissions);
      setCommissions(
        updatedCommissions.map(commission => {
          return { _id: commission };
        })
      );
    } else {
      const updatedCommissions = selectedCommissions.filter(
        id => id !== checkedId
      );
      setSelectedCommissions(updatedCommissions);
      setCommissions(
        updatedCommissions.map(commission => {
          return { _id: commission };
        })
      );
    }
  };

  const goBack = () => {
    navigate(`/${username}/artwork/${artworkId}`);
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const requestBody = {
        title,
        description,
        time,
        commissions,
        _id: artworkId,
      };

      if (inputTags.length > 0) {
        const artworkTags = inputTags.map(tag => {
          return tag.text;
        });
        requestBody.tags = artworkTags;
      } else {
        requestBody.tags = [];
      }
      if (artwork) {
        const uploadData = new FormData();
        uploadData.append('file', artwork);

        const response = await upload(uploadData);

        requestBody.artworkUrl = response.data.imgUrl;
      }
      await updateArtwork(requestBody);
      navigate(`/${username}/artwork/${artworkId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className=" h-dvh mx-10 py-24">
        <h1 hidden>Edit Artwork</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-12 gap-4 h-full"
        >
          <div className="col-span-6 flex flex-col gap-4">
            {/* Title */}
            <label
              htmlFor="title"
              className="w-full font-semibold flex flex-col gap-2"
            >
              Title
              <InputText
                required
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
                placeholder="Artwork title"
                className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand w-full"
                pt={{
                  root: {
                    className:
                      'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal',
                  },
                }}
              />
            </label>
            <div className=" border-2 border-dashed border-accent rounded flex flex-col justify-center items-center p-4 w-full h-full">
              {/* Artwork */}
              {!displayArtwork && (
                <label
                  htmlFor="artwork"
                  className=" group cursor-pointer flex flex-col gap-2 items-center font-semibold mb-2 hover:text-brand-hover"
                >
                  <img src={uploadImg} className="w-32 mb-8" alt="" />
                  <span className="underline underline-offset-4 decoration-brand decoration-2">
                    Upload artwork
                  </span>
                  <span className="mb-2 text-sm text-black-a-5 font-normal">
                    We support <span className="font-semibold">JPEG</span>,{' '}
                    <span className="font-semibold">PNG</span>,{' '}
                    <span className="font-semibold">GIF</span>,{' '}
                    <span className="font-semibold">TIFF</span> and{' '}
                    <span className="font-semibold">PNG</span>
                  </span>
                </label>
              )}
              {displayArtwork && (
                <label
                  htmlFor="artwork"
                  className=" group cursor-pointer flex flex-col gap-2 items-center justify-center font-semibold hover:text-brand-hover h-full w-full"
                >
                  <img
                    src={displayArtwork}
                    alt=""
                    className="cursor-pointer artwork-img"
                  />
                  <span className="size-0 text-white group-hover:text-brand group-hover:size-auto">
                    Replace Image
                  </span>
                </label>
              )}
              <input
                type="file"
                name="artwork"
                id="artwork"
                onChange={handleArtwork}
                className="uploadArtwork cursor-pointer"
                hidden
              />
            </div>
          </div>

          <div className="col-span-6 h-full flex flex-col items-end justify-between">
            {error && <ErrorMessage error={error} className="w-6/12" />}

            <div className="flex flex-col gap-4 ">
              {/* Description */}
              <label
                htmlFor="description"
                className="flex flex-col w-11/12 font-semibold gap-1"
              >
                Description
                <InputTextarea
                  name="description"
                  id="description"
                  value={description}
                  onChange={({ target }) => setDescription(target.value)}
                  placeholder="Insert artwork description"
                  className="portfolio focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand w-full"
                  pt={{
                    root: {
                      className:
                        'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal w-full',
                    },
                  }}
                />
              </label>

              {/* Tags */}
              <label
                htmlFor="tags"
                className="flex flex-col w-11/12 font-semibold gap-1"
              >
                Tags
                <InputTag tags={inputTags} setTags={setInputTags} />
              </label>

              {/* Time */}
              <label
                htmlFor="time"
                className="flex flex-col w-11/12 font-semibold gap-1"
              >
                Time spent on piece (hours){' '}
                <span className="font-normal mb-2 text-sm text-black-a-5 font-normal">
                  Please take into consideration time spent researching and
                  talking with your client, if it applies
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <InputNumber
                    name="time"
                    id="time"
                    required
                    value={time}
                    onChange={e => {
                      setTime(e.value);
                      handleCost(e.value);
                    }}
                    placeholder="10h"
                    min={1}
                    className="w-3/5"
                    pt={{
                      root: {
                        className: 'w-full grow-0',
                      },
                      input: {
                        className: 'w-full grow-0',
                      },
                    }}
                  />
                  <p className="flex items-center gap-2 font-normal text-gray">
                    Artwork cost:{' '}
                    {!time && (
                      <span className="text-gray font-semibold">0€</span>
                    )}
                    {time && (
                      <span className="text-black font-semibold">{`${cost}€`}</span>
                    )}
                  </p>
                </div>
              </label>

              {selectedCommissions &&
                commissionsList &&
                commissionsList.length > 0 && (
                  <>
                    <h2>Add to commissions:</h2>
                    {commissionsList.map(commission => {
                      return (
                        <label className="radio" key={commission._id}>
                          {
                            <input
                              type="checkbox"
                              name="commission"
                              value={commission._id}
                              checked={selectedCommissions.includes(
                                commission._id
                              )}
                              onChange={handleCheck}
                            />
                          }
                          {commission.exampleArtwork.length > 0 && (
                            <img
                              src={commission.exampleArtwork[0].artworkUrl}
                              alt=""
                              width={100}
                            />
                          )}
                          {commission.title}
                        </label>
                      );
                    })}
                  </>
                )}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Button
                label="Cancel"
                severity="secondary"
                text
                rounded
                className="text-grey hover:text-brand-hover hover:bg-brand/0"
                onClick={goBack}
              />

              <Button
                label="Save Changes"
                rounded
                className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                type="submit"
              />
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default EditArtwork;
