import { getAllRequests } from '../api/requests.api';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import Loading from '../components/Loading';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import SingleRequest from '../components/SingleRequest';
import requestsImg from '../assets/requests.svg';

function RequestsPage() {
  const [requests, setRequests] = useState(null);
  const [filteredRequest, setFilteredRequest] = useState([]);
  const [requestFilter, setRequestFilter] = useState(null);

  const { user } = useContext(AuthContext);

  const getRequests = async () => {
    try {
      const response = await getAllRequests(user._id);
      const reversed = response.data.reverse();
      setRequests(reversed);
      setFilteredRequest(reversed);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestsFilter = e => {
    if (e.target.value === 'pending') {
      const filterByStatus = [...requests].filter(request => {
        if (request.status === 'pending') {
          return true;
        } else {
          return false;
        }
      });
      setRequestFilter(e.target.value);
      setFilteredRequest(filterByStatus);
    } else if (e.target.value === 'approved') {
      const filterByStatus = [...requests].filter(request => {
        if (request.status === 'approved') {
          return true;
        } else {
          return false;
        }
      });
      setRequestFilter(e.target.value);
      setFilteredRequest(filterByStatus);
    } else if (e.target.value === 'completed') {
      const filterByStatus = [...requests].filter(request => {
        if (request.status === 'completed') {
          return true;
        } else {
          return false;
        }
      });
      setRequestFilter(e.target.value);
      setFilteredRequest(filterByStatus);
    } else if (e.target.value === 'rejected') {
      const filterByStatus = [...requests].filter(request => {
        if (request.status === 'rejected') {
          return true;
        } else {
          return false;
        }
      });
      setRequestFilter(e.target.value);
      setFilteredRequest(filterByStatus);
    } else if (e.target.value === 'canceled') {
      const filterByStatus = [...requests].filter(request => {
        if (request.status === 'canceled') {
          return true;
        } else {
          return false;
        }
      });
      setRequestFilter(e.target.value);
      setFilteredRequest(filterByStatus);
    } else if (e.target.value === 'all') {
      setRequestFilter(null);
      setFilteredRequest(requests);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <main className="pt-24 px-10">
      <div className="grid grid-cols-12 gap-4">
        {!requests && <Loading />}
        {requests && (
          <div className=" col-span-2 flex flex-col gap-2 w-full sticky top-6 h-[80vh]">
            <h2 className="font-semibold text-black text-xl">Filter</h2>

            <label className="flex items-center gap-2 has-[:checked]:bg-accent-light/50 has-[:checked]:text-accent-strong p-2 rounded">
              <input
                type="radio"
                name="requestFilter"
                value="all"
                checked={requestFilter === null}
                onChange={handleRequestsFilter}
                className="appearance-none"
              />
              All requests
            </label>
            <label className="flex items-center gap-2 has-[:checked]:bg-accent-light/50 has-[:checked]:text-accent-strong p-2 rounded">
              <input
                type="radio"
                name="requestFilter"
                value="pending"
                checked={requestFilter === 'pending'}
                onChange={handleRequestsFilter}
                className="appearance-none"
              />
              Pending
            </label>
            <label className="flex items-center gap-2 has-[:checked]:bg-accent-light/50 has-[:checked]:text-accent-strong p-2 rounded">
              <input
                type="radio"
                name="requestFilter"
                value="approved"
                checked={requestFilter === 'approved'}
                onChange={handleRequestsFilter}
                className="appearance-none"
              />
              Approved
            </label>
            <label className="flex items-center gap-2 has-[:checked]:bg-accent-light/50 has-[:checked]:text-accent-strong p-2 rounded">
              <input
                type="radio"
                name="requestFilter"
                value="completed"
                checked={requestFilter === 'completed'}
                onChange={handleRequestsFilter}
                className="appearance-none"
              />
              Completed
            </label>
            <label className="flex items-center gap-2 has-[:checked]:bg-accent-light/50 has-[:checked]:text-accent-strong p-2 rounded">
              <input
                type="radio"
                name="requestFilter"
                value="rejected"
                checked={requestFilter === 'rejected'}
                onChange={handleRequestsFilter}
                className="appearance-none"
              />
              Rejected
            </label>
            <label className="flex items-center gap-2 has-[:checked]:bg-accent-light/50 has-[:checked]:text-accent-strong p-2 rounded">
              <input
                type="radio"
                name="requestFilter"
                value="canceled"
                checked={requestFilter === 'canceled'}
                onChange={handleRequestsFilter}
                className="appearance-none"
              />
              Canceled
            </label>
          </div>
        )}
        <div className=" col-span-10 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black mb-4">Requests</h1>
          {requests && filteredRequest.length <= 0 && (
            <div className=" flex flex-col gap-4 items-center justify-center px-8 py-28 bg-white border-2 border-accent-light border-dashed rounded">
              <img src={requestsImg} alt="" className="w-1/12" />

              <p className="text-sm text-gray text-center">No requests yet!</p>
            </div>
          )}

          <Accordion>
            {requests &&
              filteredRequest.map(request => {
                return (
                  <AccordionTab
                    className='font-["work-sans"]'
                    pt={{
                      headerAction: {
                        className: '!bg-accent-light/30 border-accent-light',
                      },
                      content: {
                        className: 'border-accent-light text-black',
                      },
                    }}
                    header={
                      <div className="flex items-center justify-between">
                        {request.buyer.username === user.username && (
                          <div className="flex items-center gap-2">
                            <>
                              {request.artist.avatarUrl && (
                                <Avatar
                                  image={request.artist.avatarUrl}
                                  shape="circle"
                                  size="large"
                                  className="object-cover border-2 border-brand "
                                />
                              )}
                              {!request.artist.avatarUrl && (
                                <Avatar
                                  label={request.artist.username[0].toUpperCase()}
                                  shape="circle"
                                  size="large"
                                  className="object-cover border-2 border-brand "
                                />
                              )}
                            </>
                            <div className="flex flex-col gap-2">
                              <p>{request.artist.username}</p>

                              <p className="truncate font-normal">
                                {request.description}
                              </p>
                            </div>
                          </div>
                        )}
                        {request.artist.username === user.username && (
                          <div className="flex items-center gap-2">
                            <>
                              {request.buyer.avatarUrl && (
                                <Avatar
                                  image={request.buyer.avatarUrl}
                                  shape="circle"
                                  size="large"
                                  className="object-cover border-2 border-brand "
                                />
                              )}
                              {!request.buyer.avatarUrl && (
                                <Avatar
                                  label={request.buyer.username[0].toUpperCase()}
                                  shape="circle"
                                  size="large"
                                  className="object-cover border-2 border-brand "
                                />
                              )}
                            </>
                            <div className="flex flex-col gap-2">
                              <p>{request.buyer.username}</p>

                              <p className="truncate font-normal">
                                {request.description}
                              </p>
                            </div>
                          </div>
                        )}
                        <>
                          {request.status === 'pending' && (
                            <Tag
                              value={request.status}
                              rounded
                              severity="warning"
                              className='font-["work-sans"]font-semibold'
                            ></Tag>
                          )}
                          {request.status === 'rejected' && (
                            <Tag
                              value={request.status}
                              rounded
                              severity="danger"
                              className='font-["work-sans"]font-semibold'
                            ></Tag>
                          )}
                          {request.status === 'canceled' && (
                            <Tag
                              value={request.status}
                              rounded
                              severity="danger"
                              className='font-["work-sans"]font-semibold'
                            ></Tag>
                          )}
                          {request.status === 'approved' && (
                            <Tag
                              value={request.status}
                              rounded
                              className='font-["work-sans"]font-semibold'
                            ></Tag>
                          )}
                          {request.status === 'completed' && (
                            <Tag
                              value={request.status}
                              rounded
                              severity="success"
                              className='font-["work-sans"]font-semibold'
                            ></Tag>
                          )}
                        </>
                      </div>
                    }
                    key={request._id}
                  >
                    <SingleRequest
                      request={request}
                      user={user}
                      getRequests={getRequests}
                      setRequests={setRequests}
                      requests={requests}
                    />
                  </AccordionTab>
                );
              })}
          </Accordion>
        </div>
      </div>
    </main>
  );
}

export default RequestsPage;
