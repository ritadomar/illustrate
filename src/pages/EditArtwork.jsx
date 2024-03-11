import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateArtwork, getArtwork } from '../api/artwork.api';
import { upload } from '../api/upload.api';
import InputTag from '../components/InputTag';

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

  const { artworkId, username } = useParams();

  const navigate = useNavigate();

  const getSingleArtwork = async () => {
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
    console.log(response.data.artworkUrl);
    setArtist(response.data.artist);
  };

  useEffect(() => {
    getSingleArtwork();
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
        commissions,
        _id: artworkId,
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
      await updateArtwork(requestBody);
      navigate(`/${username}/${artworkId}`);
    } catch (error) {
      console.log;
    }
  };

  return (
    <>
      <main className="Authentication">
        <h1>Edit Artwork</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="artwork">
            Edit artwork:
            <img src={displayArtwork} alt="" width={'100%'} />
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

          {artist && artist.commissions && artist.commissions.length > 0 && (
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
          <button type="submit">Save changes</button>
        </form>
      </main>
    </>
  );
}

export default EditArtwork;
