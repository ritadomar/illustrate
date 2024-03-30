import { useState, useEffect, useContext } from 'react';
import { getAllCommissions } from '../api/commission.api';
// import { getAllArtworks } from '../api/artwork.api';
import { getTags } from '../api/tags.api';
import { Avatar } from 'primereact/avatar';
import { Link } from 'react-router-dom';
import { DeferredContent } from 'primereact/deferredcontent';
import { AutoComplete } from 'primereact/autocomplete';
import { CurrencyContext } from '../context/currency.context';

function FindCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredTags, setFilteredTags] = useState([]);
  const [filteredCommission, setFilteredCommission] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);

  const { currency, currencySymbol } = useContext(CurrencyContext);

  const getCommissions = async () => {
    try {
      const response = await getAllCommissions();
      const reversed = [...response.data].reverse();
      setCommissions(reversed);
      setFilteredCommission(reversed);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data.map(tag => tag.tagName));
      const sorted = [...response.data].sort((a, b) => {
        return b.commissions.length - a.commissions.length;
      });
      setPopularTags(sorted.slice(0, 10));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommissions();
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

    setFilteredTags(filtered);
  };

  const handleSearch = e => {
    setSelectedTag(e.value);

    if (priceFilter === 'low') {
      const filteredCommissions = [...commissions].filter(commission => {
        if (
          commission.tags.find(tag => {
            return tag.tagName.includes(e.value);
          }) &&
          commission.cost < 100
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredCommission(filteredCommissions);
    } else if (priceFilter === 'mid') {
      const filteredCommissions = [...commissions].filter(commission => {
        if (
          commission.tags.find(tag => {
            return tag.tagName.includes(e.value);
          }) &&
          commission.cost >= 100 &&
          commission.cost < 200
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredCommission(filteredCommissions);
    } else if (priceFilter === 'high') {
      const filteredCommissions = [...commissions].filter(commission => {
        if (
          commission.tags.find(tag => {
            return tag.tagName.includes(e.value);
          }) &&
          commission.cost >= 200
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredCommission(filteredCommissions);
    } else {
      const filteredCommissions = [...commissions].filter(commission => {
        if (
          commission.tags.find(tag => {
            return tag.tagName.includes(e.value);
          })
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredCommission(filteredCommissions);
    }
  };

  const handlePriceFilter = e => {
    if (selectedTag) {
      if (e.target.value === 'low') {
        const filterByPrice = [...commissions].filter(commission => {
          if (
            commission.tags.find(tag => {
              return tag.tagName.includes(selectedTag);
            }) &&
            commission.cost < 100
          ) {
            return true;
          } else {
            return false;
          }
        });
        setPriceFilter(e.target.value);
        setFilteredCommission(filterByPrice);
      } else if (e.target.value === 'mid') {
        const filterByPrice = [...commissions].filter(commission => {
          if (
            commission.tags.find(tag => {
              return tag.tagName.includes(selectedTag);
            }) &&
            commission.cost >= 100 &&
            commission.cost < 200
          ) {
            return true;
          } else {
            return false;
          }
        });
        setPriceFilter(e.target.value);
        setFilteredCommission(filterByPrice);
      } else if (e.target.value === 'high') {
        const filterByPrice = [...commissions].filter(commission => {
          if (
            commission.tags.find(tag => {
              return tag.tagName.includes(selectedTag);
            }) &&
            commission.cost >= 200
          ) {
            return true;
          } else {
            return false;
          }
        });
        setPriceFilter(e.target.value);
        setFilteredCommission(filterByPrice);
      } else if (e.target.value === undefined) {
        const filterByPrice = [...commissions].filter(commission => {
          if (
            commission.tags.find(tag => {
              return tag.tagName.includes(selectedTag);
            })
          ) {
            return true;
          } else {
            return false;
          }
        });
        setPriceFilter(null);
        setFilteredCommission(filterByPrice);
      }
    } else {
      if (e.target.value === 'low') {
        const filterByPrice = [...commissions].filter(commission => {
          if (commission.cost < 100) {
            return true;
          } else {
            return false;
          }
        });
        setPriceFilter(e.target.value);
        setFilteredCommission(filterByPrice);
      } else if (e.target.value === 'mid') {
        const filterByPrice = [...commissions].filter(commission => {
          if (commission.cost >= 100 && commission.cost < 200) {
            return true;
          } else {
            return false;
          }
        });
        setPriceFilter(e.target.value);
        setFilteredCommission(filterByPrice);
      } else if (e.target.value === 'high') {
        const filterByPrice = [...commissions].filter(commission => {
          if (commission.cost >= 200) {
            return true;
          } else {
            return false;
          }
        });
        setPriceFilter(e.target.value);
        setFilteredCommission(filterByPrice);
      } else if (e.target.value === undefined) {
        setPriceFilter(null);
        setFilteredCommission(commissions);
      }
    }
  };

  return (
    <main className="pt-32 px-10 flex flex-col gap-12 h-full">
      <div className="grid grid-cols-12 gap-8">
        <div className="flex flex-col gap-6 items-end col-span-3">
          <div className="flex flex-col gap-2 w-full  sticky top-6">
            <h2 className="font-semibold text-black text-xl">Browse tags</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
              {popularTags &&
                popularTags.map(tag => {
                  return (
                    <Link to={`/find/${tag.tagName}`} key={tag._id}>
                      <span className="italic font-semibold text-accent-strong hover:text-accent-dark">
                        #{tag.tagName}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>

          {tags && (
            <span className="w-full mb-3  sticky top-48">
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
          <div className="flex flex-col gap-2 w-full  sticky top-72">
            <h2 className="font-semibold text-black text-xl flex items-center justify-between">
              Filter by price
              <span
                className="text-sm font-normal underline underline-offset-2 text-brand hover:text-brand-hover cursor-pointer"
                onClick={handlePriceFilter}
              >
                Clear filter
              </span>
            </h2>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="priceFilter"
                value="low"
                checked={priceFilter === 'low'}
                onChange={handlePriceFilter}
                className="border-2 border-white h-4 w-4 rounded-full checked:bg-brand-hover checked:ring-brand-hover appearance-none ring-2 ring-brand/30"
              />
              {currencySymbol}
              {Math.round(currency.exchangeRate * 0)} - {currencySymbol}
              {Math.round(currency.exchangeRate * 100)}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="priceFilter"
                value="mid"
                checked={priceFilter === 'mid'}
                onChange={handlePriceFilter}
                className="border-2 border-white h-4 w-4 rounded-full checked:bg-brand-hover checked:ring-brand-hover appearance-none ring-2 ring-brand/30"
              />
              {currencySymbol}
              {Math.round(currency.exchangeRate * 100)} - {currencySymbol}
              {Math.round(currency.exchangeRate * 200)}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="priceFilter"
                value="high"
                checked={priceFilter === 'high'}
                onChange={handlePriceFilter}
                className="border-2 border-white h-4 w-4 rounded-full checked:bg-brand-hover checked:ring-brand-hover appearance-none ring-2 ring-brand/30"
              />
              {currencySymbol}
              {Math.round(currency.exchangeRate * 200)}+
            </label>
          </div>
        </div>
        <div className="w-full mb-4 col-span-9">
          <h1 className="text-3xl font-semibold text-black mb-8">
            Explore commissions
          </h1>
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-6 w-full">
            {filteredCommission.map(commission => {
              return (
                <DeferredContent key={commission._id} className="mb-2">
                  <article className=" bg-white flex flex-col gap-1">
                    <Link
                      to={`/${commission.artist.username}/commission/${commission._id}`}
                      className="group cursor-pointer flex flex-col gap-1 items-start col-span-1 h-56"
                    >
                      <img
                        src={commission.exampleArtwork[0].artworkUrl}
                        alt=""
                        className="w-full h-3/4 object-cover object-top rounded"
                      />
                      <div className="flex flex-col gap-0 items-start">
                        <h3 className="text-left text-lg group-hover:text-brand-hover">
                          {commission.title}
                        </h3>
                        <p className="text-md text-black font-semibold text-left">
                          <span className="font-normal">From</span>{' '}
                          {currencySymbol}
                          {Math.round(commission.cost * currency.exchangeRate)}
                        </p>
                      </div>
                    </Link>
                    <Link
                      to={`/${commission.artist.username}/`}
                      className="hover:text-brand-hover cursor-pointer z-10"
                    >
                      <div className="flex items-center gap-1">
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
                        {commission.artist.avgRating > 0 && (
                          <>
                            <span>|</span>{' '}
                            <span className="flex items-center gap-1  text-brand font-semibold">
                              <span className="pi pi-star-fill"></span>
                              <p>{commission.artist.avgRating}</p>
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  </article>
                </DeferredContent>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default FindCommissions;
