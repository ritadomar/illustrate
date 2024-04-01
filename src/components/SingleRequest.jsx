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
          <p className="wrap-paragraph">{request.description}</p>

          {request.buyer === null &&
            request.artist.username === user.username && (
              <>
                {status === 'pending' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <div></div>
                    <div className="flex gap-4 justify-end">
                      <Button
                        label="Reject"
                        rounded
                        disabled
                        severity="danger"
                        size="small"
                        text
                        onClick={() => handleUpdate('rejected')}
                      />
                      <Button
                        label="Accept"
                        rounded
                        disabled
                        severity="success"
                        size="small"
                        outlined
                        onClick={() => handleUpdate('approved')}
                      />
                    </div>
                  </div>
                )}

                {status === 'approved' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <div></div>
                    <div className="flex gap-4 justify-end">
                      <Button
                        label="Cancel commission"
                        disabled
                        rounded
                        outlined
                        severity="danger"
                        size="small"
                        onClick={() => handleUpdate('canceled')}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          {request.artist === null &&
            request.buyer.username === user.username && (
              <>
                {status === 'pending' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <div></div>
                    <div className="flex gap-4 justify-end">
                      <Button
                        label="Reject"
                        rounded
                        disabled
                        severity="danger"
                        size="small"
                        text
                        onClick={() => handleUpdate('rejected')}
                      />
                      <Button
                        label="Accept"
                        rounded
                        disabled
                        severity="success"
                        size="small"
                        outlined
                        onClick={() => handleUpdate('approved')}
                      />
                    </div>
                  </div>
                )}

                {status === 'approved' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <div></div>
                    <div className="flex gap-4 justify-end">
                      <Button
                        label="Cancel commission"
                        rounded
                        outlined
                        disabled
                        severity="danger"
                        size="small"
                        onClick={() => handleUpdate('canceled')}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          {request.buyer !== null &&
            request.artist !== null &&
            request.artist.username === user.username && (
              <>
                {status === 'pending' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <a
                      href={`mailto:${request.buyer.email}`}
                      className="font-semibold text-brand hover:text-brand-hover"
                    >
                      {/* <Button
                        label={`Contact ${request.buyer.username}`}
                        rounded
                        className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                      /> */}
                      Contact {request.buyer.username}
                    </a>
                    <div className="flex gap-4 justify-end">
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
                  </div>
                )}

                {status === 'approved' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <a
                      href={`mailto:${request.buyer.email}`}
                      className="font-semibold text-brand hover:text-brand-hover"
                    >
                      {/* <Button
                        label={`Contact ${request.buyer.username}`}
                        rounded
                        className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                      /> */}
                      Contact {request.buyer.username}
                    </a>
                    <div className="flex gap-4 justify-end">
                      <Button
                        label="Cancel commission"
                        rounded
                        outlined
                        severity="danger"
                        size="small"
                        onClick={() => handleUpdate('canceled')}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          {request.buyer !== null &&
            request.artist !== null &&
            request.buyer.username === user.username && (
              <>
                {status === 'pending' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <a
                      href={`mailto:${request.artist.email}`}
                      className="font-semibold text-brand hover:text-brand-hover"
                    >
                      {/* <Button
                        label={`Contact ${request.buyer.username}`}
                        rounded
                        className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                      /> */}
                      Contact {request.artist.username}
                    </a>
                    <div className="flex gap-4 justify-end">
                      <Button
                        label="Cancel request"
                        rounded
                        severity="danger"
                        size="small"
                        outlined
                        onClick={() => handleUpdate('canceled')}
                      />
                    </div>
                  </div>
                )}

                {status === 'approved' && (
                  <div className="flex justify-between items-baseline  mt-2">
                    <a
                      href={`mailto:${request.artist.email}`}
                      className="font-semibold text-brand hover:text-brand-hover"
                    >
                      {/* <Button
                        label={`Contact ${request.buyer.username}`}
                        rounded
                        className="bg-brand border-brand hover:border-opacity-0 hover:bg-brand-hover"
                      /> */}
                      Contact {request.artist.username}
                    </a>
                    <div className="flex gap-4 justify-end">
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
