import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addArtwork } from '../api/artwork.api';
import { upload } from '../api/upload.api';
import { AuthContext } from '../context/auth.context';
import InputTag from '../components/InputTag';
import { getProfile } from '../api/profiles.api';

function UploadArt() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artwork, setArtwork] = useState('');
  const [tags, setTags] = useState([]);
  const [inputTags, setInputTags] = useState([]);
  const [time, setTime] = useState('');
  const [cost, setCost] = useState(0);
  const [commissions, setCommissions] = useState([]);
  const [displayArtwork, setDisplayArtwork] = useState('');
  const [artist, setArtist] = useState(null);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const getArtist = async () => {
    try {
      const response = await getProfile(user._id);
      setArtist(response.data);
      console.log(response.data.rate);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtist();
  }, []);

  const handleArtwork = ({ target }) => {
    console.log(target.files[0]);
    setArtwork(target.files[0]);
    setDisplayArtwork(URL.createObjectURL(target.files[0]));
  };

  const handleCost = time => {
    setCost(time * artist.rate);
  };

  const handleCheck = e => {
    const commissionsArray = commissions;
    commissionsArray.push(e.target.value);
    setCommissions(commissionsArray);
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
        tags,
      };

      //   if (tags.length > 0) {
      //     const artworkTags = tags.split(',');
      //     console.log(artworkTags);
      //     requestBody.tags = artworkTags;
      //   }

      if (inputTags.length > 0) {
        const artworkTags = inputTags.map(tag => {
          return tag.text;
        });
        console.log(artworkTags);
        setTags(artworkTags);
      }
      if (artwork) {
        const uploadData = new FormData();
        uploadData.append('file', artwork);

        const response = await upload(uploadData);
        console.log(response.data);

        requestBody.artworkUrl = response.data.imgUrl;
      }
      await addArtwork(requestBody);
      navigate('/');
    } catch (error) {
      console.log;
    }
  };

  return (
    <>
      <main className="Authentication">
        <h1>Upload Artwork</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="artwork">
            {artwork && (
              <>
                Edit artwork:
                <img src={displayArtwork} alt="" width={'100%'} />
              </>
            )}
            {!artwork && 'Upload your artwork:'}
            <input
              type="file"
              name="artwork"
              id="artwork"
              onChange={handleArtwork}
            />
          </label>
          <label htmlFor="title">
            Title:
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Artwork title"
            />
          </label>
          <label htmlFor="description">
            Description:
            <textarea
              type="text"
              name="description"
              id="description"
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              placeholder="Insert artwork description"
            />
          </label>
          <label htmlFor="tags">
            Tags:
            {/* <input
              type="text"
              name="tags"
              id="tags"
              value={tags}
              onChange={({ target }) => setTags(target.value)}
            /> */}
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

          {artist && artist.commissions.length > 0 && (
            <>
              <label htmlFor="commissions">Add to commissions:</label>
              {artist.commissions.map(commission => {
                return (
                  <label className="radio" key={commission._id}>
                    <input
                      type="checkbox"
                      name="commission"
                      value={commission._id}
                      onChange={handleCheck}
                    ></input>
                    <p>{commission.title}</p>
                  </label>
                );
              })}
            </>
          )}
          <button type="submit">Upload artwork</button>
        </form>
      </main>
    </>
  );
}

export default UploadArt;
