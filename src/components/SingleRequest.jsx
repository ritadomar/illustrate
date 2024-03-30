/* eslint-disable react/prop-types */
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { updateRequest } from '../api/requests.api';
import CreateRating from './CreateRating';

function SingleRequest({ request, user, getRequests }) {
  const [status, setStatus] = useState(request.status);
  const [visible, setVisible] = useState(false);

  const handleUpdate = async newStatus => {
    try {
      const requestBody = {
        status: newStatus,
        _id: request._id,
        userId: user._id,
      };

      await updateRequest(requestBody);
      setStatus(newStatus);
      if (newStatus === 'completed') {
        setVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequests();
  }, [status]);

  return (
    <>
      {status && (
        <>
          <p>{request.description}</p>
          {request.artist.username === user.username && (
            <>
              {status === 'pending' && (
                <div className="flex gap-4 mt-2 justify-end">
                  <Button
                    label="Reject"
                    rounded
                    severity="danger"
                    size="small"
                    text
                    onClick={() => handleUpdate('rejected')}
                  />
                  <Button
                    label="Accept"
                    rounded
                    severity="success"
                    size="small"
                    outlined
                    onClick={() => handleUpdate('approved')}
                  />
                </div>
              )}

              {status === 'approved' && (
                <div className="flex gap-4 mt-2 justify-end">
                  <Button
                    label="Cancel commission"
                    rounded
                    outlined
                    severity="danger"
                    size="small"
                    onClick={() => handleUpdate('canceled')}
                  />
                </div>
              )}
            </>
          )}
          {request.buyer.username === user.username && (
            <>
              {status === 'pending' && (
                <div className="flex gap-2 mt-2 justify-end">
                  <Button
                    label="Cancel request"
                    rounded
                    severity="danger"
                    size="small"
                    outlined
                    onClick={() => handleUpdate('canceled')}
                  />
                </div>
              )}

              {status === 'approved' && (
                <div className="flex gap-4 mt-2 justify-end">
                  <Button
                    label="Cancel commission"
                    rounded
                    text
                    severity="danger"
                    size="small"
                    onClick={() => handleUpdate('canceled')}
                  />
                  <Button
                    label="Mark as completed"
                    rounded
                    outlined
                    severity="success"
                    size="small"
                    onClick={() => handleUpdate('completed')}
                  />
                </div>
              )}
              <CreateRating
                giver={request.buyer}
                receiver={request.artist}
                visible={visible}
                setVisible={setVisible}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

export default SingleRequest;
