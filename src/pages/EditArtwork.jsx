import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateArtwork, getArtwork } from '../api/artwork.api';
import { getCommission } from '../api/commission.api';
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
      if (artist.commissions.length > 0) {
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

  // const checkCommission = commissionId => {
  //   const commissionsArray = commissions;
  //   const commissionExists = commissionsArray.find(commission => {
  //     return commission._id === commissionId;
  //   });
  //   if (commissionExists) {
  //     setSelectedCommissions([...selectedCommissions, commissionId]);
  //   } else {
  //     setSelectedCommissions(
  //       selectedCommissions.filter(id => id !== commissionId)
  //     );
  //   }
  //   return (
  //     <input
  //       type="checkbox"
  //       name="commission"
  //       value={commissionId}
  //       checked={selectedCommissions.includes(commissionId)}
  //       onChange={handleCheck}
  //     />
  //   );
  // };

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
          <button type="submit">Save changes</button>
        </form>
      </main>
    </>
  );
}

export default EditArtwork;
