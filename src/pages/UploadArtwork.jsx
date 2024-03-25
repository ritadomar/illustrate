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
import { Chips } from 'primereact/chips';

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

  const { isSigning, setIsSigning } = useContext(AuthContext);

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

  const navigate = useNavigate();

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
        console.log(response.data);

        requestBody.artworkUrl = response.data.imgUrl;
      }
      await addArtwork(requestBody);
      navigate(`/${user.username}`);
    } catch (error) {
      console.log;
    }
  };

  return (
    <>
      <main className=" h-dvh mx-10 py-24">
        <h1 hidden>Upload Artwork</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-12 gap-10 h-full"
        >
          {/* <label htmlFor="artwork"> */}
          {/* {artwork && (
            <>
              Edit artwork:
              <img src={displayArtwork} alt="" width={'100%'} />
            </>
          )} */}

          {/* Artwork */}
          <div className="col-span-6 border-2 border-dashed border-accent rounded flex flex-col justify-center items-center p-4 w-full h-full">
            {!artwork && (
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

          {/* {!artwork && 'Upload your artwork:'}
            <input
              type="file"
              name="artwork"
              id="artwork"
              onChange={handleArtwork}
            />
          </label> */}
          <div className="col-span-6 h-screen flex flex-col items-center pt-16 gap-2">
            <label
              htmlFor="title"
              className="flex flex-col w-8/12 font-semibold gap-1"
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
                className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand"
                pt={{
                  root: {
                    className:
                      'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal',
                  },
                }}
              />
            </label>
            <label
              htmlFor="description"
              className="flex flex-col w-6/12 font-semibold gap-1"
            >
              Description
              <InputTextarea
                autoResize
                name="description"
                id="description"
                value={description}
                onChange={({ target }) => setDescription(target.value)}
                placeholder="Insert artwork description"
                className="portfolio focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand"
                pt={{
                  root: {
                    className:
                      'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal',
                  },
                }}
              />
            </label>
            <label
              htmlFor="tags"
              className="flex flex-col w-6/12 font-semibold gap-1"
            >
              Tags
              <InputTag tags={inputTags} setTags={setInputTags} />
            </label>
            <label htmlFor="time">
              Time spent on piece (hours):
              <input
                type="number"
                name="time"
                id="time"
                value={time}
                onChange={({ target }) => {
                  setTime(target.value);
                  handleCost(target.value);
                }}
                placeholder="10h"
              />
              <p>Artwork cost: {time && `${cost}€`}</p>
            </label>

            {commissionsList && commissionsList.length > 0 && (
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
                          checked={selectedCommissions.includes(commission._id)}
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
            <button type="submit">Upload artwork</button>
          </div>
        </form>
      </main>
    </>
  );
}

export default UploadArt;
