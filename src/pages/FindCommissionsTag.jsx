import { useState, useEffect, useContext } from 'react';
import { CurrencyContext } from '../context/currency.context';
import { getTag } from '../api/tags.api';
import { Avatar } from 'primereact/avatar';
import { Link, useParams } from 'react-router-dom';
import { DeferredContent } from 'primereact/deferredcontent';
import { getCommission } from '../api/commission.api';
import uploadImg from '../assets/upload.svg';

function FindCommissionsTag() {
  const [commissions, setCommissions] = useState(null);
  const [filteredCommission, setFilteredCommission] = useState(null);

  const [tag, setTag] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);

  const { tagName } = useParams();
  const { currency, currencySymbol } = useContext(CurrencyContext);

  const getSingleTag = async () => {
    try {
      const response = await getTag(tagName);
      setTag(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommissions = async () => {
    try {
      if (tag) {
        const commission = tag.commissions.map(commission => {
          const singleCommission = getCommission(commission);
          return singleCommission;
        });

        const response = await Promise.all(commission);

        const populateCommissions = response.map(response => {
          return response.data;
        });

        console.log(populateCommissions);
        setFilteredCommission(populateCommissions);
        setCommissions(populateCommissions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePriceFilter = e => {
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
  };

  useEffect(() => {
    getCommissions();
  }, [tag]);

  useEffect(() => {
    getSingleTag();
  }, []);

  return (
    <main className="pt-32 px-10 flex flex-col gap-12 h-full">
      <div className="grid grid-cols-12 gap-8">
        {tag && (
          <>
            <div className="flex flex-col gap-6 items-end col-span-3">
              <div className="flex flex-col gap-2 w-full  sticky top-6">
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
              <h1 className="text-3xl font-semibold text-brand mb-8">
                <span className=" text-black">Browsing </span>#{tag.tagName}
              </h1>
              <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-6 w-full">
                {!commissions ||
                  !filteredCommission ||
                  (filteredCommission.length <= 0 && (
                    <>
                      <div className="flex flex-col gap-4 items-center justify-center col-span-1 p-8 bg-white border-2 border-accent-light border-dashed rounded h-64">
                        <img src={uploadImg} alt="" className="w-1/4" />

                        <p className="text-sm text-gray text-center">
                          No commissions yet!
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-64"></div>
                      <div className="flex flex-col gap-4 items-center justify-center col-span-1 bg-white bg-gradient-to-t from-accent-light/50 to-accent-light/10 rounded h-64"></div>
                    </>
                  ))}
                {commissions &&
                  filteredCommission.map(commission => {
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
                                {Math.round(
                                  commission.cost * currency.exchangeRate
                                )}
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
          </>
        )}
      </div>
    </main>
  );
}

export default FindCommissionsTag;
