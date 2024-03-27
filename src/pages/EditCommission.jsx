import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import InputTag from '../components/InputTag';
import { getProfile } from '../api/profiles.api';
import { getCommission, updateCommission } from '../api/commission.api';
import ErrorMessage from '../components/ErrorMessage';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';

function EditCommission() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputTags, setInputTags] = useState([]);

  const [exampleArtwork, setExampleArtwork] = useState([]);
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);

  // controlling dynamic checklist
  const [selectedArtwork, setSelectedArtwork] = useState([]);

  const { user, isSigning, setIsSigning } = useContext(AuthContext);
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

  const goBack = () => {
    navigate('/');
  };

  useEffect(() => {
    getSingleCommission();
    getArtist();
  }, []);

  useEffect(() => {
    setIsSigning(true);
    return () => {
      setIsSigning(false);
    };
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
      setError(error.response.data.message);

      console.log;
    }
  };

  return (
    <main className=" h-dvh mx-10 py-24">
      <h1 className="absolute inset-x-0 top-6 text-2xl font-bold text-center text-black -z-10">
        Edit Commission
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-6 flex flex-col gap-4">
          {/* Title */}
          <label
            htmlFor="title"
            className="w-11/12 font-semibold flex flex-col gap-2"
          >
            Title
            <InputText
              required
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Commission title"
              className="focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand w-full"
              pt={{
                root: {
                  className:
                    'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal',
                },
              }}
            />
          </label>
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
              placeholder="Insert commission description"
              rows={10}
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
        </div>
        <section className="col-span-6 h-full">
          <h2 className="font-semibold mb-2">Select Artwork</h2>
          {/* artwork */}
          <ScrollPanel
            style={{ width: '100%', height: '70vh' }}
            pt={{
              barY: {
                className: 'bg-accent-light',
              },
            }}
          >
            <div className="grid grid-cols-3 gap-2 pr-4 rounded">
              {artist &&
                artist.artwork[0]._id &&
                artist.artwork.map(artwork => {
                  return (
                    <label
                      htmlFor={artwork._id}
                      key={artwork._id}
                      className="aspect-square p-2 rounded border-accent-light border-2 flex flex-col gap-1 has-[:checked]:bg-accent-light/50 has-[:checked]:border-brand has-[:checked]:font-semibold has-[:checked]:border-brand/0"
                    >
                      <div className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          name="exampleArtwork"
                          id={artwork._id}
                          checked={selectedArtwork.includes(artwork._id)}
                          value={artwork._id}
                          onChange={handleOnChange}
                          className="border-1 border-white h-4 w-4 rounded checked:bg-brand-hover checked:ring-brand-hover appearance-none ring-2 ring-brand/30"
                        />
                        <span className="pi pi-check text-xs text-white -ml-[22px]"></span>
                        <p className="truncate">{artwork.title}</p>
                      </div>
                      <img
                        src={artwork.artworkUrl}
                        alt={artwork.title}
                        className="no-pin aspect-square object-cover object-top bg-white rounded-sm"
                      />
                    </label>
                  );
                })}
            </div>
          </ScrollPanel>

          {/* SUBMIT */}
          <div className="flex items-center gap-4 mt-4 absolute top-0 right-10">
            <Button
              label="Cancel"
              severity="secondary"
              text
              rounded
              className="text-grey hover:text-brand-hover hover:bg-brand/0"
              onClick={goBack}
            />
            <Button
              label="Save changes"
              rounded
              className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
              type="submit"
            />
          </div>
        </section>
      </form>
      {error && <ErrorMessage error={error} className="w-6/12" />}
    </main>
  );
}

export default EditCommission;
