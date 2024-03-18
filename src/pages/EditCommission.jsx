import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import InputTag from '../components/InputTag';
import { getProfile } from '../api/profiles.api';
import { getCommission, updateCommission } from '../api/commission.api';

function EditCommission() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputTags, setInputTags] = useState([]);
  //   const [time, setTime] = useState('');
  //   const [cost, setCost] = useState(0);
  const [exampleArtwork, setExampleArtwork] = useState([]);
  const [artist, setArtist] = useState(null);

  // to display artwork list
  // const [artworkList, setArtworkList] = useState(null);

  // controlling dynamic checklist
  const [selectedArtwork, setSelectedArtwork] = useState([]);

  const { user } = useContext(AuthContext);
  const { commissionId } = useParams();

  const navigate = useNavigate();

  const getSingleCommission = async () => {
    try {
      const response = await getCommission(commissionId);
      setTitle(response.data.title);
      setDescription(response.data.description);
      const tags = response.data.tags.map(tag => {
        return { id: tag._id, text: tag.tagName };
      });
      setInputTags(tags);
      setExampleArtwork(response.data.exampleArtwork);
      setArtist(response.data.artist);

      const checkedArtwork = response.data.exampleArtwork.map(artwork => {
        return artwork._id;
      });

      setSelectedArtwork(checkedArtwork);
    } catch (error) {
      console.log(error);
    }
  };

  const getArtist = async () => {
    try {
      const response = await getProfile(user.username);
      setArtist(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleCommission();
    getArtist();
  }, []);

  const handleOnChange = e => {
    const { value, checked } = e.target;

    if (checked) {
      const updatedArtworks = [...exampleArtwork, value];
      setSelectedArtwork(updatedArtworks);
      setExampleArtwork(
        updatedArtworks.map(artwork => {
          return { _id: artwork };
        })
      );
    } else {
      const updatedArtworks = selectedArtwork.filter(id => id !== value);
      setSelectedArtwork(updatedArtworks);
      setExampleArtwork(
        updatedArtworks.map(artwork => {
          return { _id: artwork };
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
        exampleArtwork,
        artistId: user._id,
        _id: commissionId,
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

      await updateCommission(requestBody);
      navigate(`/${user.username}`);
    } catch (error) {
      console.log;
    }
  };

  return (
    <main className="Authentication">
      <h1>Edit Commission</h1>
      <form onSubmit={handleSubmit}>
        {artist &&
          artist.artwork[0]._id &&
          artist.artwork.map(artwork => {
            return (
              <label htmlFor={artwork._id} key={artwork._id}>
                <input
                  type="checkbox"
                  name="exampleArtwork"
                  id={artwork._id}
                  checked={selectedArtwork.includes(artwork._id)}
                  value={artwork._id}
                  onChange={handleOnChange}
                />
                <p>{artwork.title}</p>
                <img src={artwork.artworkUrl} alt="" />
              </label>
            );
          })}

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

        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}

export default EditCommission;
