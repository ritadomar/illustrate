import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addArtwork } from '../api/artwork.api';
import { upload } from '../api/upload.api';
import { AuthContext } from '../context/auth.context';
import InputTag from '../components/InputTag';
import { getProfile } from '../api/profiles.api';
import { getCommission } from '../api/commission.api';
import uploadImg from '../assets/upload.svg';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import ErrorMessage from '../components/ErrorMessage';
import { ScrollPanel } from 'primereact/scrollpanel';
import timeImg from '../assets/time.svg';

function UploadArt() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artwork, setArtwork] = useState('');
  const [inputTags, setInputTags] = useState([]);
  const [time, setTime] = useState('');
  const [cost, setCost] = useState(0);
  const [commissions, setCommissions] = useState([]);
  const [displayArtwork, setDisplayArtwork] = useState('');
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);

  const { isSigning, setIsSigning } = useContext(AuthContext);

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  useEffect(() => {
    setIsSigning(true);
    return () => {
      setIsSigning(false);
    };
  }, []);
  // to display commissions list
  const [commissionsList, setCommissionsList] = useState(null);

  // controlling dynamic checkbox
  const [selectedCommissions, setSelectedCommissions] = useState([]);

  const { user } = useContext(AuthContext);

  const getArtist = async () => {
    try {
      const response = await getProfile(user.username);
      setArtist(response.data);
      // setCommissionsList(response.data.commissions);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommissions = async () => {
    try {
      if (artist && artist.commissions.length > 0) {
        const commissionsList = artist.commissions.map(commission => {
          const details = getCommission(commission._id);
          return details;
        });
        const response = await Promise.all(commissionsList);
        const responseData = response.map(response => {
          return response.data;
        });
        setCommissionsList(responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtist();
  }, []);

  useEffect(() => {
    getCommissions();
  }, [commissions, artist]);

  const handleArtwork = ({ target }) => {
    console.log(target.files[0]);
    setArtwork(target.files[0]);
    setDisplayArtwork(URL.createObjectURL(target.files[0]));
  };

  const handleCost = time => {
    setCost(time * artist.rate);
  };

  const handleCheck = e => {
    // const commissionsArray = commissions;
    // commissionsArray.push(e.target.value);
    // setCommissions(commissionsArray);
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

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const requestBody = {
        title,
        description,
        time,
        artistId: user._id,
        commissions,
      };

      if (inputTags.length > 0) {
        const artworkTags = inputTags.map(tag => {
          return tag.text;
        });
        console.log(artworkTags);
        requestBody.tags = artworkTags;
      } else {
        requestBody.tags = [];
      }
      if (artwork) {
        const uploadData = new FormData();
        uploadData.append('file', artwork);

        const response = await upload(uploadData);
        const optimized = response.data.imgUrl.replace(
          '/upload/',
          '/upload/f_auto,q_auto/'
        );

        requestBody.artworkUrl = optimized;
      }
      await addArtwork(requestBody);
      navigate(`/${user.username}`);
    } catch (error) {
      setError(error.response.data.message);
      console.log;
    }
  };

  return (
    <>
      <main className=" h-dvh mx-10 py-24">
        <h1 className="absolute inset-x-0 top-6 text-2xl font-bold text-center text-black -z-10">
          Upload Artwork
        </h1>
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
              {!artwork && (
                <label
                  htmlFor="artwork"
                  className=" group cursor-pointer flex flex-col gap-2 items-center font-semibold mb-2 hover:text-brand-hover"
                >
                  <img src={uploadImg} className="w-32 mb-8" alt="" />
                  <span className="underline underline-offset-4 decoration-brand decoration-2">
                    Upload artwork
                  </span>
                  <span className="mb-2 text-sm text-black-a-5 font-normal text-center">
                    We support <span className="font-semibold">JPEG</span>,{' '}
                    <span className="font-semibold">PNG</span>,{' '}
                    <span className="font-semibold">GIF</span>,{' '}
                    <span className="font-semibold">TIFF</span> and{' '}
                    <span className="font-semibold">PNG</span> <br />
                    Make sure your file is under{' '}
                    <span className="font-semibold">10MB</span>
                  </span>
                </label>
              )}
              {artwork && (
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
                  className=" focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand w-full portfolio"
                  pt={{
                    root: {
                      className:
                        'portfolio text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal w-full',
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

              <section className="commissions">
                <h2 className="font-semibold mb-2">Add to Commissions</h2>
                {(!commissionsList || commissionsList.length <= 0) && (
                  <div
                    className="flex flex-col justify-center items-center gap-2 bg-white border-2 border-accent-light border-dashed rounded"
                    style={{ width: '100%', height: '25vh' }}
                  >
                    <img src={timeImg} alt="" className="w-2/12" />

                    <p className="text-sm text-gray text-center">
                      You don't have any commissions yet!
                    </p>
                  </div>
                )}

                {commissionsList && commissionsList.length > 0 && (
                  <>
                    <ScrollPanel
                      style={{ width: '100%', height: '25vh' }}
                      pt={{
                        barY: {
                          className: 'bg-accent-light',
                        },
                      }}
                    >
                      <div className="grid grid-cols-3 gap-2 pr-4 rounded">
                        {commissionsList.map(commission => {
                          return (
                            <label
                              htmlFor={commission._id}
                              key={commission._id}
                              className="p-2 rounded border-accent-light border-2 flex flex-col gap-1 has-[:checked]:bg-accent-light/50 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0"
                            >
                              <div className="flex gap-2 items-center">
                                <input
                                  type="checkbox"
                                  name="commission"
                                  id={commission._id}
                                  value={commission._id}
                                  checked={selectedCommissions.includes(
                                    commission._id
                                  )}
                                  onChange={handleCheck}
                                  className="border-1 border-white h-4 w-4 rounded checked:bg-brand-hover checked:ring-brand-hover appearance-none ring-2 ring-brand/30"
                                />
                                <span className="pi pi-check text-xs text-white -ml-[22px]"></span>
                                <p className="truncate">{commission.title}</p>
                              </div>
                              {commission.exampleArtwork.length > 0 && (
                                <img
                                  src={commission.exampleArtwork[0].artworkUrl}
                                  alt={commission.title}
                                  className="no-pin aspect-video object-cover object-top bg-white rounded-sm"
                                />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </ScrollPanel>
                  </>
                )}
              </section>
            </div>
            <div className="flex items-center gap-4 mt-4 absolute top-0 right-10">
              <Button
                label="Cancel"
                severity="secondary"
                text
                rounded
                className="text-grey hover:text-brand-hover hover:bg-brand/0"
                onClick={goBack}
              />
              {(time === null ||
                time === 0 ||
                time.length <= 0 ||
                title.length <= 0 ||
                displayArtwork.length <= 0) && (
                <Button
                  label="Upload Artwork"
                  rounded
                  className="bg-black-a-5/30 border-black-a-5/0 hover:border-opacity-0 hover:bg-brand-hover"
                  disabled
                />
              )}
              {time && title && displayArtwork && (
                <Button
                  label="Upload Artwork"
                  rounded
                  className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                  type="submit"
                />
              )}
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default UploadArt;
