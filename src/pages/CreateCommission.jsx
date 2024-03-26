import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import InputTag from '../components/InputTag';
import { getProfile } from '../api/profiles.api';
import { addCommission } from '../api/commission.api';
import ErrorMessage from '../components/ErrorMessage';

function CreateCommission() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputTags, setInputTags] = useState([]);
  //   const [time, setTime] = useState('');
  //   const [cost, setCost] = useState(0);
  const [exampleArtwork, setExampleArtwork] = useState([]);
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const getArtist = async () => {
    try {
      const response = await getProfile(user.username);
      setArtist(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtist();
  }, []);

  //   const handleArtwork = ({ target }) => {
  //     console.log(target.files[0]);
  //     setArtwork(target.files[0]);
  //     setDisplayArtwork(URL.createObjectURL(target.files[0]));
  //   };

  const handleOnChange = e => {
    const { value, checked } = e.target;
    console.log(`${value} is ${checked}`);

    if (checked) {
      setExampleArtwork([...exampleArtwork, value]);
    } else {
      setExampleArtwork(exampleArtwork.filter(e => e !== value));
    }
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const requestBody = {
        title,
        description,
        exampleArtwork,
        artistId: user._id,
      };

      if (inputTags.length > 0) {
        const commissionTags = inputTags.map(tag => {
          return tag.text;
        });
        console.log(commissionTags);
        requestBody.tags = commissionTags;
      } else {
        requestBody.tags = [];
      }

      await addCommission(requestBody);
      navigate(`/${user.username}`);
    } catch (error) {
      setError(error.response.data.message);

      console.log;
    }
  };

  return (
    <>
      <main className="Authentication">
        <h1>Create Commission</h1>
        <form onSubmit={handleSubmit}>
          {artist &&
            artist.artwork &&
            artist.artwork.map(artwork => {
              return (
                <label htmlFor={artwork._id} key={artwork._id}>
                  <input
                    type="checkbox"
                    name="exampleArtwork"
                    id={artwork._id}
                    value={artwork._id}
                    onChange={handleOnChange}
                  />
                  <p>{artwork.title}</p>
                  <img src={artwork.artworkUrl} alt="" />
                </label>
              );
            })}

          {/* <label htmlFor="artwork">
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
          </label> */}
          <label htmlFor="title">
            Title:
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Commission title"
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
              placeholder="Insert commission description"
            />
          </label>
          <label htmlFor="tags">
            Tags:
            <InputTag tags={inputTags} setTags={setInputTags} />
          </label>
          {/* <label htmlFor="time">
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
          </label> */}

          <button type="submit">Create commission</button>
        </form>
        {error && <ErrorMessage error={error} />}
      </main>
    </>
  );
}

export default CreateCommission;
