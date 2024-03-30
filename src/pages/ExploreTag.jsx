import { useState, useEffect } from 'react';
import { getTag } from '../api/tags.api';
import { Avatar } from 'primereact/avatar';
import { Link, useParams } from 'react-router-dom';
import { DeferredContent } from 'primereact/deferredcontent';
import { getArtwork } from '../api/artwork.api';
import uploadImg from '../assets/upload.svg';

function ExploreTag() {
  const [artworks, setArtworks] = useState(null);
  const [tag, setTag] = useState(null);

  const { tagName } = useParams();

  const getSingleTag = async () => {
    try {
      const response = await getTag(tagName);
      setTag(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getArtworks = async () => {
    try {
      if (tag) {
        const artwork = tag.artwork.map(artwork => {
          console.log(artwork);
          const singleArtwork = getArtwork(artwork);
          return singleArtwork;
        });

        const response = await Promise.all(artwork);

        const populateArtworks = response.map(response => {
          return response.data;
        });

        setArtworks(populateArtworks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtworks();
  }, [tag]);

  useEffect(() => {
    getSingleTag();
  }, []);

  return (
    <main className="pt-32 px-10 flex flex-col gap-12 h-full">
      {tag && (
        <>
          <div className="flex gap-4 items-end justify-between">
            <h1 className="font-semibold text-brand text-xl">
              <span className=" text-black">Browsing </span>#{tag.tagName}
            </h1>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 w-full">
            {artworks &&
              artworks.map(artwork => {
                return (
                  <DeferredContent key={artwork._id}>
                    <article className="artwork flex flex-col gap-2 mb-4">
                      <Link
                        to={`/${artwork.artist.username}/artwork/${artwork._id}`}
                        className="hover:text-brand-hover cursor-pointer"
                      >
                        <div
                          style={{
                            '--image-url': `url(${artwork.artworkUrl})`,
                          }}
                          className="bg-[image:var(--image-url)]  bg-no-repeat bg-cover aspect-square rounded  bg-white border-2 border-accent-light"
                        >
                          <div className="flex p-4 items-end w-full h-full hover:bg-gradient-to-t from-black-a-5 artwork-overlay rounded">
                            <h3 className="text-lg artwork-title">
                              {artwork.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                      <Link
                        to={`/${artwork.artist.username}/`}
                        className="hover:text-brand-hover cursor-pointer z-10"
                      >
                        <div className="flex items-center gap-1">
                          {artwork.artist.avatarUrl && (
                            <Avatar
                              image={artwork.artist.avatarUrl}
                              size="small"
                              shape="circle"
                              className="object-cover border-2 border-brand w-6 h-6"
                            />
                          )}
                          {!artwork.artist.avatarUrl && (
                            <Avatar
                              label={artwork.artist.username[0].toUpperCase()}
                              size="small"
                              shape="circle"
                              className="object-cover border-2 border-brand w-6 h-6"
                            />
                          )}
                          <p>{artwork.artist.username}</p>
                          {artwork.artist.avgRating > 0 && (
                            <>
                              <span>|</span>{' '}
                              <span className="flex items-center gap-1  text-brand font-semibold">
                                <span className="pi pi-star-fill"></span>
                                <p>{artwork.artist.avgRating}</p>
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                    </article>
                  </DeferredContent>
                );
              })}
            {!artworks && (
              <>
                <div className="flex flex-col gap-4 items-center justify-center col-span-1 p-8 bg-white border-2 border-accent-light border-dashed rounded h-72">
                  <img src={uploadImg} alt="" className="w-1/4" />

                  <p className="text-sm text-gray text-center">
                    No artwork yet!
                  </p>
                </div>
                <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
                <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-72"></div>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default ExploreTag;
