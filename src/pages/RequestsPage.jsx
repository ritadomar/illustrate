import { getAllRequests } from '../api/requests.api';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import Loading from '../components/Loading';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import SingleRequest from '../components/SingleRequest';

function RequestsPage() {
  const [requests, setRequests] = useState(null);

  const { user } = useContext(AuthContext);

  const getRequests = async () => {
    try {
      const response = await getAllRequests(user._id);
      const reversed = response.data.reverse();
      setRequests(reversed);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <main className="grid grid-cols-12 pt-24 pl-10 pr-32 gap-4">
      {!requests && <Loading />}
      <Accordion activeIndex={0} className="col-span-10">
        {requests &&
          requests.map(request => {
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
                          <p>{request.artist.username}</p>
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
    </main>
  );
}

export default RequestsPage;
