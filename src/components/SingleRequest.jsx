import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { updateRequest } from '../api/requests.api';
import { Rating } from 'primereact/rating';

function SingleRequest({ request, user, getRequests, setRequests, requests }) {
  const [status, setStatus] = useState(request.status);
  const [rating, setRating] = useState(null);

  console.log(rating);

  const handleUpdate = async newStatus => {
    try {
      const requestBody = {
        status: newStatus,
        _id: request._id,
        userId: user._id,
      };

      await updateRequest(requestBody);
      setStatus(newStatus);
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
                    label="Cancel"
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

              {status === 'completed' && (
                <div className="flex gap-4 mt-2 justify-end">
                  <p>Rate {request.buyer.username}</p>{' '}
                  <Rating
                    cancel={false}
                    value={rating}
                    onChange={e => setRating(e.value)}
                    className="text-brand"
                    pt={{
                      onIcon: {
                        className: 'text-brand focus:shadow-none',
                      },
                      offIcon: {
                        className:
                          'text-gray hover:text-brand focus:shadow-none',
                      },
                      item: {
                        className: 'focus:shadow-none',
                      },
                      root: {
                        className: 'gap-1',
                      },
                    }}
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
                    label="Cancel"
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
                    label="Cancel"
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

              {status === 'completed' && (
                <div className="flex gap-2 mt-2 justify-end">
                  <p>Rate {request.artist.username}</p>{' '}
                  <Rating
                    cancel={false}
                    value={rating}
                    onChange={e => setRating(e.value)}
                    className="text-brand"
                    pt={{
                      onIcon: {
                        className: 'text-brand focus:shadow-none',
                      },
                      offIcon: {
                        className:
                          'text-gray hover:text-brand focus:shadow-none',
                      },
                      item: {
                        className: 'focus:shadow-none',
                      },
                      root: {
                        className: 'gap-1',
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default SingleRequest;
