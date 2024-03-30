import { useState, useContext } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Avatar } from 'primereact/avatar';
import { AuthContext } from '../context/auth.context';
import { CurrencyContext } from '../context/currency.context';
import { newRequest } from '../api/requests.api';
import { useNavigate } from 'react-router-dom';

function MakeRequest({ commission, visible, setVisible }) {
  const [description, setDescription] = useState('');

  const { user } = useContext(AuthContext);
  const { currencySymbol, currency } = useContext(CurrencyContext);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const requestBody = {
        buyer: user._id,
        commission: commission._id,
        description,
      };
      await newRequest(requestBody);
      setVisible(false);
      //   navigate(`/`);
    } catch (error) {
      console.log;
    }
  };

  return (
    <Dialog
      header="Request commission"
      visible={visible}
      style={{ width: '50vw' }}
      onHide={() => setVisible(false)}
    >
      <article className="grid grid-cols-2 gap-2 p-2 bg-accent-light  mb-4 rounded">
        <img
          src={commission.exampleArtwork[0].artworkUrl}
          alt=""
          className="w-full  h-32 aspect-video object-cover object-top rounded bg-white"
        />
        <div className="flex flex-col gap-1 items- justify-end col-span-1">
          <div className="flex flex-col gap-0 items-start">
            <h3 className="text-left text-lg group-hover:text-brand-hover">
              {commission.title}
            </h3>
            <p className="text-md text-black font-semibold text-left">
              <span className="font-normal">From</span> {currencySymbol}
              {Math.round(commission.cost * currency.exchangeRate)}
            </p>
          </div>
          <div className="flex items-start gap-1">
            {commission.artist.avatarUrl && (
              <Avatar
                image={commission.artist.avatarUrl}
                size="small"
                shape="circle"
                className="object-cover border-2 border-brand w-6 h-6"
              />
            )}
            {!commission.artist.avatarUrl && (
              <Avatar
                label={commission.artist.username[0].toUpperCase()}
                size="small"
                shape="circle"
                className="object-cover border-2 border-brand w-6 h-6"
              />
            )}
            <p>{commission.artist.username}</p>
          </div>
        </div>
      </article>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="description"
          className="flex flex-col font-semibold gap-1"
        >
          Description
          <span className="text-gray text-sm font-normal">
            Please provide as much useful information about the specs of the
            project, including size, purpose, media, and deadline
          </span>
          <InputTextarea
            name="description"
            id="description"
            value={description}
            rows={5}
            onChange={({ target }) => setDescription(target.value)}
            placeholder="Insert description for your commission. Please provide as much useful information about the specs of the project, including size, purpose, media, and deadline"
            className="portfolio focus:border-brand focus:shadow-[0_0_0_1px_rgb(204,32,92)] hover:border-brand shadow-none valid:shadow-[0_0_0_1px_rgb(204,32,92)] valid:border-brand w-full"
            pt={{
              root: {
                className:
                  'text-black font-medium filled:border-2 placeholder:text-black/30 placeholder:font-normal w-full',
              },
            }}
          />
        </label>
        <div className="flex items-center gap-4 mt-4 w-full justify-end">
          <Button
            label="Cancel"
            severity="secondary"
            text
            rounded
            className="text-grey hover:text-brand-hover hover:bg-brand/0"
            onClick={() => setVisible(false)}
          />
          {!description && (
            <Button
              label="Make Request"
              rounded
              disabled
              className="bg-black-a-5/30 border-black-a-5/0 hover:border-opacity-0 hover:bg-brand-hover"
            />
          )}
          {description && (
            <Button
              label="Make Request"
              rounded
              className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
              type="submit"
            />
          )}
        </div>
      </form>
    </Dialog>
  );
}

export default MakeRequest;
