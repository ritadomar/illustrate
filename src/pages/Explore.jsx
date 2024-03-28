import { useState, useEffect } from 'react';
import { getAllArtworks } from '../api/artwork.api';
import { getTags } from '../api/tags.api';
import { Avatar } from 'primereact/avatar';
import { Link } from 'react-router-dom';
import { DeferredContent } from 'primereact/deferredcontent';
import { AutoComplete } from 'primereact/autocomplete';

function Explore() {
  const [artworks, setArtworks] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredTags, setFilteredTags] = useState([]);
  const [filteredArtwork, setFilteredArtwork] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  const getArtworks = async () => {
    try {
      const response = await getAllArtworks();
      const reversed = [...response.data].reverse();
      setArtworks(reversed);
      setFilteredArtwork(reversed);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data.map(tag => tag.tagName));
      const sorted = [...response.data].sort((a, b) => {
        return b.artwork.length - a.artwork.length;
      });
      setPopularTags(sorted.slice(0, 15));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtworks();
    getAllTags();
  }, []);

  const search = e => {
    const filtered = [...tags].filter(tag => {
      if (tag.includes(e.query)) {
        return true;
      } else {
        return false;
      }
    });
    // const filteredArt = [...artworks].filter(art => {
    //   if (
    //     art.tags.find(tag => {
    //       return tag.tagName.includes(e.query);
    //     })
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    setFilteredTags(filtered);
    // setFilteredArtwork(filteredArt);
  };

  const handleSearch = e => {
    setSelectedTag(e.value);
    // const filtered = [...tags].filter(tag => {
    //   if (tag.includes(e.value)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    const filteredArt = [...artworks].filter(art => {
      if (
        art.tags.find(tag => {
          return tag.tagName.includes(e.value);
        })
      ) {
        return true;
      } else {
        return false;
      }
    });
    // setFilteredTags(filtered);
    setFilteredArtwork(filteredArt);
  };

  return (
    <main className="pt-32 px-10 flex flex-col gap-12 h-full">
      <h1 className="hidden">Explore illustrations</h1>
      <div className="flex gap-4 items-end justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-black text-xl">
            Browse popular tags
          </h2>
          <div className="flex gap-4 items-center">
            {popularTags &&
              popularTags.map(tag => {
                return (
                  <Link to={`/explore/${tag.tagName}`} key={tag._id}>
                    <span className="italic font-semibold text-accent-strong hover:text-accent-dark">
                      #{tag.tagName}
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
        {tags && (
          <span className="flex-grow">
            <span className="pi pi-search text-black absolute ml-3 mt-[14px] z-10"></span>
            <AutoComplete
              value={selectedTag}
              suggestions={filteredTags}
              completeMethod={search}
              onChange={handleSearch}
              placeholder={'Search tags'}
              className="p-inputtext-sm w-full"
              pt={{
                root: {
                  className: 'w-full',
                },
              }}
            />
          </span>
        )}
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 w-full">
        {filteredArtwork.map(artwork => {
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
                      <h3 className="text-lg artwork-title">{artwork.title}</h3>
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
                  </div>
                </Link>
              </article>
            </DeferredContent>
          );
        })}
      </div>
    </main>
  );
}

export default Explore;
