import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Script from 'next/script';
import {
  LocationPointIcon,
  ChevronRightIcon,
  CloseIcon,
  ArrowLeftIcon,
} from '@/Components/Icons';
import Sidebar from '@/Components/Sidebar';
import PageHeader from '@/Components/PageHeader';
import Spinner from '@/Components/Spinner';
import Backdrop from '@/Components/Backdrop';
import useDatabase from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import Head from 'next/head';

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const Modal = ({
  airspace: { title, address, id, expirationDate, currentPrice },
  onCloseModal,
  isOffer,
}) => {
  return (
    <Fragment>
      <div className='fixed left-1/2 top-1/2 z-50 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-[15px] bg-white px-[29px] py-[30px] md:h-auto md:w-[689px] md:rounded-[30px]'>
        <div
          className='relative -mx-[29px] -mt-[30px] flex items-center gap-[20px] px-[29px] py-[20px] md:mx-0 md:my-0 md:p-0 md:shadow-none'
          style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
        >
          <div className='h-[12px] w-[16px] md:hidden' onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <h2 className='text-center text-xl font-medium text-[#222222]'>
            {title || address}
          </h2>
          <div
            onClick={onCloseModal}
            className='absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block'
          >
            <CloseIcon />
          </div>
        </div>
        <div
          className='flex items-center gap-[10px] rounded-lg px-[22px] py-4'
          style={{ border: '1px solid #4285F4' }}
        >
          <div className='h-6 w-6'>
            <LocationPointIcon />
          </div>
          <p className='flex-1 text-[14px] font-normal text-[#222222]'>
            {address}
          </p>
        </div>
        {Object.entries({
          ID: id,
          'Expiration Date': expirationDate,
          'Current Price': currentPrice,
        }).map(([key, value]) => {
          if (!value) return;
          return (
            <div className='flex gap-[15px]'>
              <p className='text-[14px] font-normal text-[#222222]'>{key}:</p>
              <p className='text-[14px] font-normal text-[#87878D]'>{value}</p>
            </div>
          );
        })}
        {isOffer ? (
          <div
            className='-mx-[30px] -mb-[30px] mt-auto flex gap-[20px] px-[14px] py-[16px] md:mx-0 md:mb-0 md:mt-[15px] md:px-0 md:py-0 md:shadow-none'
            style={{ boxShadow: '0px 0px 4.199999809265137px 0px #00000040' }}
          >
            <div className='flex flex-col'>
              <p className='text-[12px] font-normal text-[#838187]'>
                Offer received
              </p>
              <p className='text-2xl font-bold text-[#222222]'>
                {USDollar.format(99.87)}
              </p>
            </div>
            <div
              onClick={onCloseModal}
              className='flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-white px-[20px] py-[10px] text-center text-[#0653EA]'
              style={{ border: '1px solid #0653EA' }}
            >
              Decline
            </div>
            <div
              className='flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-[#0653EA] px-[20px] py-[10px] text-center text-white'
              style={{ border: '1px solid #0653EA' }}
            >
              Approve
            </div>
          </div>
        ) : (
          <div className='-mx-[30px] -mb-[30px] mt-auto flex gap-[20px] px-[14px] py-[16px] md:mx-0 md:mb-0 md:mt-[15px] md:px-0 md:py-0'>
            <div
              onClick={onCloseModal}
              className='flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-white px-[20px] py-[10px] text-center text-[#0653EA]'
              style={{ border: '1px solid #0653EA' }}
            >
              Cancel
            </div>
            <div
              className='flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-[#0653EA] px-[20px] py-[10px] text-center text-white'
              style={{ border: '1px solid #0653EA' }}
            >
              Edit
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

const PortfolioItem = ({ airspaceName, tags, selectAirspace }) => {
  return (
    <div
      onClick={selectAirspace}
      className='flex cursor-pointer items-center justify-between gap-[10px] rounded-lg bg-white p-[11px]'
      style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
    >
      <div className='flex flex-1 items-center gap-[10px]'>
        <div className='h-6 w-6'>
          <LocationPointIcon />
        </div>
        <p className='flex-1 text-[14px] font-normal text-[#222222]'>
          {airspaceName}
        </p>
      </div>
      <div className='flex items-center gap-[10px]'>
        {!!tags[0] && (
          <div className='cursor-pointer rounded-[3px] bg-[#DBDBDB] px-[7px] text-sm font-normal text-[#222222]'>
            On Rent
          </div>
        )}
        {!!tags[1] && (
          <div className='cursor-pointer rounded-[3px] bg-[#E7E6E6] px-[7px] text-sm font-normal text-[#222222]'>
            On Sale
          </div>
        )}
        {!!tags[2] && (
          <div className='cursor-pointer rounded-[3px] bg-[#222222] px-[7px] text-sm font-normal text-white'>
            No Fly Zone
          </div>
        )}
        {!!tags[3] && (
          <div className='cursor-pointer rounded-[3px] bg-[#E04F64] px-[7px] text-sm font-normal text-white'>
            Review Offer
          </div>
        )}
        <div className='h-[14px] w-[7px]'>
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  );
};

const PortfolioItemMobile = ({ airspaceName, tags, selectAirspace }) => {
  return (
    <div
      onClick={selectAirspace}
      className='flex cursor-pointer items-center justify-between gap-[10px] p-[11px] px-[20px]'
      style={{ borderBottom: '1px solid #DBDBDB' }}
    >
      <div className='flex flex-1 items-center gap-[10px]'>
        <div className='h-6 w-6'>
          <LocationPointIcon />
        </div>
        <p className='flex-1 text-[14px] font-normal text-[#222222]'>
          {airspaceName}
        </p>
      </div>
      <div className='flex items-center gap-[10px]'>
        {!!tags[0] && (
          <div className='cursor-pointer rounded-[3px] bg-[#DBDBDB] px-[7px] text-sm font-normal text-[#222222]'>
            On Rent
          </div>
        )}
        {!!tags[1] && (
          <div className='cursor-pointer rounded-[3px] bg-[#E7E6E6] px-[7px] text-sm font-normal text-[#222222]'>
            On Sale
          </div>
        )}
        {!!tags[2] && (
          <div className='cursor-pointer rounded-[3px] bg-[#222222] px-[7px] text-sm font-normal text-white'>
            No Fly Zone
          </div>
        )}
        {!!tags[3] && (
          <div className='cursor-pointer rounded-[3px] bg-[#E04F64] px-[7px] text-sm font-normal text-white'>
            Review Offer
          </div>
        )}
        <div className='h-[14px] w-[7px]'>
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  );
};
const PortfolioList = ({ title, airspacesList, selectAirspace }) => {
  console.log('all airspacesz ', airspacesList);
  return (
    <div
      className='flex min-w-[516px] flex-1 flex-col gap-[43px] rounded-[30px] bg-white px-[29px] py-[43px]'
      style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
    >
      <h2 className='text-center text-xl font-medium text-[#222222]'>
        {title}
      </h2>
      <div className='flex flex-col gap-[15px]'>
        {airspacesList.map(({ address, expirationDate, name }, index) => (
          <PortfolioItem
            airspaceName={address}
            key={index}
            tags={[true, false, false, false]}
            selectAirspace={() => selectAirspace(index)}
          />
        ))}
      </div>
    </div>
  );
};

const PortfolioListMobile = ({ airspacesList, selectAirspace }) => {
  return (
    <div className='flex w-full flex-col gap-[11px]'>
      {airspacesList.map(({ title, address, noFlyZone }, index) => (
        <PortfolioItemMobile
          airspaceName={title || address}
          tags={[false, false, noFlyZone, false]}
          selectAirspace={() => selectAirspace(index)}
        />
      ))}
    </div>
  );
};

const PortfolioSectionMobile = ({ title, airspacesList, onGoBack }) => {
  return (
    <div className='pointer-events-none fixed left-1/2 top-1/2 z-[60] h-screen w-screen -translate-x-1/2 -translate-y-1/2 bg-white'>
      <div className='flex h-full w-full flex-col'>
        <div
          className='flex items-center justify-between bg-white px-[21px] py-[25.5px] text-[#222222]'
          style={{ boxShadow: '0px 2px 12px 0px #00000014' }}
        >
          <div className='h-[12px] w-[16px]' onClick={onGoBack}>
            <ArrowLeftIcon />
          </div>
          <p className='mx-auto text-xl font-normal md:m-0 md:font-medium'>
            {title}
          </p>
        </div>
        <div className='relative flex w-full flex-wrap gap-6 py-[20px]'>
          {airspacesList.map(({ name }, index) => (
            <PortfolioItem
              airspaceName={name || address}
              tags={[1, 1, 1, 1]}
              selectAirspace={() => selectAirspace(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAirspace, setSelectedAirspace] = useState(null);
  const { getPropertiesByUserAddress } = useDatabase();
  const [myAirspaces, setMyAirspaces] = useState([]);
  const { user } = useAuth();

  const myAirspacesTest = {
    items: [
      {
        name: 'My Airspace in Sacramento',
        address: '4523 14th Avenue, Sacramento, California, USA',
        id: 'vucnrld,xepH785TUFNRVZUCHQ3',
        expirationDate: '15 january 2024 at 11:49 AM',
        currentPrice: null,
      },
      {
        name: 'My Airspace in Santa Brígida',
        address: 'Villa de Santa Brígida, Las Palmas, Spain',
        id: 'vucnrld,xepH785TUFNRVZUCHQ4',
        expirationDate: '20 february 2024 at 01:00 PM',
        currentPrice: null,
      },
      {
        name: 'My Airspace in Las Canteras',
        address: 'Las Palmas de Gran Canaria, Las Palmas, Spain',
        id: 'vucnrld,xepH785TUFNRVZUCHQ5',
        expirationDate: '14 march 2024 at 04:00 AM',
        currentPrice: null,
      },
    ],
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const response = await getPropertiesByUserAddress(
          user.blockchainAddress,
          'rentalToken'
        );
        //test
        //const response =myAirspacesTest;
        if (response) {
          let resp = await response.items;

          let retrievedAirspaces = await resp.map((item) => {
            return {
              address: item.metadata.addresses[0],
              name: item.metadata.name,
              expirationDate: new Date(item.metadata.endTime).toString(),
            };
          });
          setMyAirspaces(retrievedAirspaces);
        }

        console.log('the items from resport=', response.items);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user]);

  const onCloseModal = () => {
    setSelectedAirspace(null);
  };

  const selectAirspace = (x) => {
    setSelectedAirspace(x);
  };

  return (
    <Fragment>
      <Head>
        <title>Portfolio</title>
      </Head>
      {isLoading &&
        createPortal(<Backdrop />, document?.getElementById('backdrop-root'))}
      {isLoading &&
        createPortal(<Spinner />, document?.getElementById('backdrop-root'))}
      {selectedAirspace !== null && <Backdrop onClick={onCloseModal} />}

      <div className='relative flex h-screen w-screen items-center justify-center overflow-hidden rounded bg-[#F0F0FA]'>
        <Sidebar />
        <div className='flex h-full w-full flex-col'>
          {selectedAirspace !== null && (
            <Modal
              airspace={myAirspaces[selectedAirspace]}
              onCloseModal={onCloseModal}
            />
          )}
          <PageHeader pageTitle={'Portfolio'} username={'John Doe'} />
          <section className='relative hidden h-full w-full flex-wrap gap-6 overflow-y-auto px-[45px] py-[43px] md:flex'>
            <PortfolioList
              airspacesList={myAirspaces}
              title={'Rented airspaces'}
              selectAirspace={selectAirspace}
            />
          </section>
          <section className='relative mb-[79px] flex h-full w-full flex-wrap gap-6 overflow-y-auto py-[20px] md:hidden'>
            <PortfolioListMobile
              airspacesList={myAirspaces}
              title={'Rented airspaces'}
              selectAirspace={selectAirspace}
            />
          </section>
          {/** TODO: <PortfolioSectionMobile title={'Hola'} airspacesList={myAirspacesToSellAndRent} />*/}
        </div>
      </div>
    </Fragment>
  );
};

export default Portfolio;
