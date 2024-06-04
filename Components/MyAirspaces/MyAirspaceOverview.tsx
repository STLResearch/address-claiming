import Image from 'next/image';

const MyAirspaceOverview = (props) => {
  // const locationiqKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;

  return (
    <div
      className='absolute top-5 z-10 rounded-md bg-white'
      style={{
        width: '339px',
        height: '90%',
        maxHeight: '537px',
        left: '380px',
        boxShadow: '6px -7px 4px -2px rgba(100,94,94,0.64)',
      }}
    >
      <div className='relative rounded-t-md' style={{ height: '230px' }}>
        <Image
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${props.longitute},${props.latitude},14,0/300x200?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`}
          alt='a static map'
          className='rounded-t-md'
          width={339}
          height={422}
        />
        <button
          onClick={props.closeDetails}
          className='absolute right-2 top-2 flex flex-row items-center justify-center bg-white'
          style={{ borderRadius: '50%', width: '24px', height: '24px' }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='44'
            height='44'
            viewBox='0 0 34 34'
            fill='none'
          >
            <path
              d='M12.7578 12.7285L21.2431 21.2138'
              stroke='#252530'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12.7569 21.2138L21.2422 12.7285'
              stroke='#252530'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
      <div style={{ height: '537px' }}>
        <div className='mb-2 flex flex-row items-center justify-between px-5'>
          <p className='mt-5 font-bold'>{props.title}</p>
          <button
            onClick={props.editAirspace}
            className='mt-3 flex items-center justify-center'
            style={{
              height: '27px',
              width: '27px',
              border: '1px solid blue',
              borderRadius: '50%',
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='14'
              height='14'
              viewBox='0 0 14 14'
              fill='none'
            >
              <path
                d='M8.75033 13.2702H5.25033C2.08283 13.2702 0.729492 11.9169 0.729492 8.74935V5.24935C0.729492 2.08185 2.08283 0.728516 5.25033 0.728516H6.41699C6.65616 0.728516 6.85449 0.926849 6.85449 1.16602C6.85449 1.40518 6.65616 1.60352 6.41699 1.60352H5.25033C2.56116 1.60352 1.60449 2.56018 1.60449 5.24935V8.74935C1.60449 11.4385 2.56116 12.3952 5.25033 12.3952H8.75033C11.4395 12.3952 12.3962 11.4385 12.3962 8.74935V7.58268C12.3962 7.34352 12.5945 7.14518 12.8337 7.14518C13.0728 7.14518 13.2712 7.34352 13.2712 7.58268V8.74935C13.2712 11.9169 11.9178 13.2702 8.75033 13.2702Z'
                fill='#0653EA'
              />
              <path
                d='M4.95828 10.3193C4.60244 10.3193 4.27578 10.191 4.03661 9.95766C3.75078 9.67182 3.62828 9.25766 3.69244 8.82016L3.94328 7.06432C3.98994 6.72599 4.21161 6.28849 4.45078 6.04932L9.04744 1.45266C10.2083 0.291823 11.3866 0.291823 12.5474 1.45266C13.1833 2.08849 13.4691 2.73599 13.4108 3.38349C13.3583 3.90849 13.0783 4.42182 12.5474 4.94682L7.95078 9.54349C7.71161 9.78266 7.27411 10.0043 6.93578 10.051L5.17994 10.3018C5.10411 10.3193 5.02828 10.3193 4.95828 10.3193ZM9.66578 2.07099L5.06911 6.66766C4.95828 6.77849 4.82994 7.03516 4.80661 7.18682L4.55578 8.94266C4.53244 9.11182 4.56744 9.25182 4.65494 9.33932C4.74244 9.42682 4.88244 9.46182 5.05161 9.43849L6.80744 9.18766C6.95911 9.16432 7.22161 9.03599 7.32661 8.92516L11.9233 4.32849C12.3024 3.94932 12.5008 3.61099 12.5299 3.29599C12.5649 2.91682 12.3666 2.51432 11.9233 2.06516C10.9899 1.13182 10.3483 1.39432 9.66578 2.07099Z'
                fill='#0653EA'
              />
              <path
                d='M11.5794 5.73367C11.5386 5.73367 11.4977 5.72784 11.4627 5.71617C9.92857 5.28451 8.7094 4.06534 8.27774 2.53117C8.21357 2.29784 8.34774 2.05867 8.58107 1.98867C8.8144 1.92451 9.05357 2.05867 9.11774 2.29201C9.46774 3.53451 10.4536 4.52034 11.6961 4.87034C11.9294 4.93451 12.0636 5.17951 11.9994 5.41284C11.9469 5.61117 11.7719 5.73367 11.5794 5.73367Z'
                fill='#0653EA'
              />
            </svg>
          </button>
        </div>
        <div className='flex flex-row items-center justify-end'>
          {!props.noFlyZone && (
            <p className='me-5 mt-3 text-sml text-dark-blue'>
              <span className='font-bold'>{props.amount}</span>/transit
            </p>
          )}
        </div>
        <div
          className='mt-5 flex flex-row items-center justify-center gap-7 pb-2.5'
          style={{ borderBottom: '0.5px solid rgba(229, 229, 234, 0.7)' }}
        >
          <button className='relative' onClick={props.viewMyAirspace}>
            <p className='font-bold text-dark-blue'>Overview</p>
            <div
              style={{
                height: '4px',
                width: '40px',
                bottom: '-10px',
                left: '10%',
              }}
              className='absolute rounded-t-md bg-dark-blue'
            ></div>
          </button>
          {/* <button className="relative" onClick={props.myAirspaceReview}>
                    <p className="font-bold text-brown">Reviews</p>
                </button> */}
          {/* <button className="relative" onClick={props.aboutMyAirspace}>
                    <p className="font-bold text-brown">About</p>
                </button> */}
        </div>

        <div
          style={{ width: '100%', height: '30%' }}
          className='overflow-y-auto rounded-b-md'
        >
          <div
            style={{ width: '299px', border: '1px solid blue' }}
            className='mx-auto my-6 rounded p-2.5'
          >
            <h3 className='text-brown text-sm font-bold'>
              AirSpace Owner Detail
            </h3>
            <p
              className='mt-2 text-xs'
              style={{ fontSize: '11px', color: 'rgba(63, 61, 86, 0.75)' }}
            >
              <span className='font-bold'>Resident Name: </span>
              {props.name}
            </p>
            <p
              className='text-xs'
              style={{ fontSize: '11px', color: 'rgba(63, 61, 86, 0.75)' }}
            >
              <span className='font-bold'>Email: </span>
              {props.email}
            </p>
          </div>

          <div
            style={{ width: '299px', border: '1px solid blue' }}
            className='mx-auto my-6 rounded p-2.5'
          >
            <h3 className='text-brown text-sm font-bold'>AirSpace Details</h3>
            <p className='mt-2 text-sm text-light-brown'>
              <span className='font-bold'>Addreess: </span>
              {props.address}
            </p>
            <p className='text-sm text-light-brown'>
              <span className='font-bold'>Resident Email: </span>
              {props.email}
            </p>
          </div>

          <div className='flex flex-row items-center justify-center gap-7'>
            <div className='flex flex-col items-center justify-center'>
              <button
                style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                className='bg-dark-blue p-2.5'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                >
                  <path
                    d='M10.433 14.2754C10.1464 14.2754 9.8597 14.2154 9.62637 14.1021L6.12637 12.3487C5.92637 12.2487 5.53303 12.2554 5.3397 12.3687L3.76637 13.2687C3.08637 13.6554 2.38637 13.7087 1.8597 13.3954C1.32637 13.0887 1.02637 12.4621 1.02637 11.6754V5.19539C1.02637 4.58872 1.42637 3.90206 1.95303 3.60206L4.8397 1.94872C5.32637 1.66872 6.06637 1.64872 6.56637 1.90206L10.0664 3.65539C10.2664 3.75539 10.653 3.74206 10.853 3.63539L12.4197 2.74206C13.0997 2.35539 13.7997 2.30206 14.3264 2.61539C14.8597 2.92206 15.1597 3.54872 15.1597 4.33539V10.8221C15.1597 11.4287 14.7597 12.1154 14.233 12.4154L11.3464 14.0687C11.093 14.2021 10.7597 14.2754 10.433 14.2754ZM5.7597 11.2821C6.04637 11.2821 6.33303 11.3421 6.56637 11.4554L10.0664 13.2087C10.2664 13.3087 10.653 13.2954 10.853 13.1887L13.7397 11.5354C13.953 11.4154 14.1597 11.0554 14.1597 10.8154V4.32872C14.1597 3.90872 14.0397 3.59539 13.8197 3.47539C13.6064 3.35539 13.273 3.40206 12.913 3.60872L11.3464 4.50206C10.8597 4.78206 10.1197 4.80206 9.6197 4.54872L6.1197 2.79539C5.9197 2.69539 5.53303 2.70872 5.33303 2.81539L2.44637 4.46872C2.23303 4.58872 2.02637 4.94872 2.02637 5.19539V11.6821C2.02637 12.1021 2.14637 12.4154 2.3597 12.5354C2.57303 12.6621 2.90637 12.6087 3.27303 12.4021L4.8397 11.5087C5.0997 11.3554 5.43303 11.2821 5.7597 11.2821Z'
                    fill='white'
                  />
                  <path
                    d='M5.70606 11.8327C5.43272 11.8327 5.20605 11.606 5.20605 11.3327V2.66602C5.20605 2.39268 5.43272 2.16602 5.70606 2.16602C5.97939 2.16602 6.20606 2.39268 6.20606 2.66602V11.3327C6.20606 11.606 5.97939 11.8327 5.70606 11.8327Z'
                    fill='white'
                  />
                  <path
                    d='M10.4873 13.8321C10.214 13.8321 9.9873 13.6054 9.9873 13.3321V4.41211C9.9873 4.13878 10.214 3.91211 10.4873 3.91211C10.7606 3.91211 10.9873 4.13878 10.9873 4.41211V13.3321C10.9873 13.6054 10.7606 13.8321 10.4873 13.8321Z'
                    fill='white'
                  />
                </svg>
              </button>
              <p className='text-center text-sm text-dark-blue'>3D Map</p>
            </div>
            {!props.noFlyZone && props.propertyStatus !== 'NotVerified' && (
              <div
                onClick={() => alert('Button clicked')}
                className='flex flex-col items-center justify-center'
              >
                <button
                  style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    border: '1px solid blue',
                  }}
                  className='bg-white p-2.5'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='15'
                    height='15'
                    viewBox='0 0 15 15'
                    fill='none'
                  >
                    <path
                      d='M7.5 14.2188C3.79375 14.2188 0.78125 11.2063 0.78125 7.5C0.78125 3.79375 3.79375 0.78125 7.5 0.78125C11.2063 0.78125 14.2188 3.79375 14.2188 7.5C14.2188 11.2063 11.2063 14.2188 7.5 14.2188ZM7.5 1.71875C4.3125 1.71875 1.71875 4.3125 1.71875 7.5C1.71875 10.6875 4.3125 13.2813 7.5 13.2813C10.6875 13.2813 13.2813 10.6875 13.2813 7.5C13.2813 4.3125 10.6875 1.71875 7.5 1.71875Z'
                      fill='#0653EA'
                    />
                    <path
                      d='M9.81914 9.95586C9.73789 9.95586 9.65664 9.93711 9.58164 9.88711L7.64414 8.73086C7.16289 8.44336 6.80664 7.81211 6.80664 7.25586V4.69336C6.80664 4.43711 7.01914 4.22461 7.27539 4.22461C7.53164 4.22461 7.74414 4.43711 7.74414 4.69336V7.25586C7.74414 7.48086 7.93164 7.81211 8.12539 7.92461L10.0629 9.08086C10.2879 9.21211 10.3566 9.49961 10.2254 9.72461C10.1316 9.87461 9.97539 9.95586 9.81914 9.95586Z'
                      fill='#0653EA'
                    />
                  </svg>
                </button>
                <p className='text-center text-sm text-dark-blue'>Rent</p>
              </div>
            )}
          </div>
          {(props.landingDeck || props.chargingStation || props.storageHub) && (
            <div
              style={{ width: '299px', border: '1px solid blue' }}
              className='mx-auto my-6 rounded p-2.5'
            >
              <h3 className='text-brown text-sm font-bold'>Facilities</h3>
              {props.landingDeck && (
                <p className='text-sm text-light-brown'>
                  <span className='font-bold'>Landing Deck: </span>Place to land
                  your UAV safely
                </p>
              )}
              {props.chargingStation && (
                <p className='text-sm text-light-brown'>
                  <span className='font-bold'>Charging Station: </span>We offer
                  a place to charge your UAV
                </p>
              )}
              {props.storageHub && (
                <p className='text-sm text-light-brown'>
                  <span className='font-bold'>Storage Hub: </span>Warehousing
                  for UAV packages
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAirspaceOverview;
