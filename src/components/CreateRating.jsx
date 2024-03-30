import { useState } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';

import { newRating } from '../api/ratings.api';

function CreateRating({ giver, receiver, visible, setVisible }) {
  const [rating, setRating] = useState(null);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const requestBody = {
        rating,
        giverId: giver._id,
        receiverId: receiver._id,
      };
      await newRating(requestBody);
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      // header={`Rate ${receiver.username}`}
      visible={visible}
      style={{ width: '30vw' }}
      onHide={() => setVisible(false)}
    >
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="description"
          className="flex flex-col  items-center font-semibold gap-2 mb-10"
        >
          How did {receiver.username} do?
          <Rating
            cancel={false}
            value={rating}
            onChange={e => setRating(e.value)}
            className="text-brand"
            pt={{
              onIcon: {
                className: 'text-brand focus:shadow-none ',
              },
              offIcon: {
                className: 'text-gray hover:text-brand focus:shadow-none',
              },
              item: {
                className: 'focus:shadow-none ',
              },
              root: {
                className: 'gap-1',
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
            size="small"
            className="text-grey hover:text-brand-hover hover:bg-brand/0"
            onClick={() => setVisible(false)}
          />
          {!rating && (
            <Button
              label="Submit rating"
              rounded
              size="small"
              disabled
              className="bg-black-a-5/30 border-black-a-5/0 hover:border-opacity-0 hover:bg-brand-hover"
            />
          )}
          {rating && (
            <Button
              label="Submit rating"
              rounded
              size="small"
              className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
              type="submit"
            />
          )}
        </div>
      </form>
    </Dialog>
  );
}

export default CreateRating;
