import Image from 'next/image';

const EditUavModal = (props) => {
  return (
    <div
      className='fixed z-20 overflow-y-auto rounded bg-white px-12 pb-10'
      style={{
        width: '886px',
        height: '90vh',
        maxHeight: '1001px',
        top: '5vh',
        left: 'calc(50% - 443px)',
      }}
    >
      <div className='mt-20 flex flex-row items-center justify-center gap-4'>
        <h2 className='font-bold'>Edit UAV Details</h2>
      </div>
      <div className='relative' style={{ width: '290px' }}>
        <p className='font-medium text-light-brown'>Upload an Image</p>
        <Image
          src='/images/uav.png'
          alt='a picture of UAV'
          width={290}
          height={217}
        />
        <div className='absolute bottom-2 right-2 flex flex-row gap-2'>
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='rounded bg-white p-1 transition-all duration-500 ease-in-out hover:bg-bleach-blue'
              width='27'
              height='27'
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
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='rounded bg-white p-1 transition-all duration-500 ease-in-out hover:bg-bleach-blue'
              width='27'
              height='27'
              viewBox='0 0 17 17'
              fill='none'
            >
              <path
                d='M7.08317 1.59375C6.78977 1.59375 6.55192 1.8316 6.55192 2.125V2.65625H3.5415C3.2481 2.65625 3.01025 2.8941 3.01025 3.1875C3.01025 3.4809 3.2481 3.71875 3.5415 3.71875H13.4582C13.7516 3.71875 13.9894 3.4809 13.9894 3.1875C13.9894 2.8941 13.7516 2.65625 13.4582 2.65625H10.4478V2.125C10.4478 1.8316 10.2099 1.59375 9.9165 1.59375H7.08317Z'
                fill='#C80000'
              />
              <path
                d='M7.08317 7.54375C7.37657 7.54375 7.61442 7.78159 7.61442 8.075L7.61442 13.0333C7.61442 13.3267 7.37657 13.5646 7.08317 13.5646C6.78977 13.5646 6.55192 13.3267 6.55192 13.0333L6.55192 8.075C6.55192 7.78159 6.78977 7.54375 7.08317 7.54375Z'
                fill='#C80000'
              />
              <path
                d='M10.4478 8.075C10.4478 7.78159 10.2099 7.54375 9.9165 7.54375C9.6231 7.54375 9.38525 7.78159 9.38525 8.075V13.0333C9.38525 13.3267 9.6231 13.5646 9.9165 13.5646C10.2099 13.5646 10.4478 13.3267 10.4478 13.0333V8.075Z'
                fill='#C80000'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M4.24376 5.608C4.27366 5.33896 4.50107 5.13542 4.77176 5.13542H12.2279C12.4986 5.13542 12.726 5.33896 12.7559 5.608L12.8977 6.88395C13.1547 9.19689 13.1547 11.5312 12.8977 13.8441L12.8837 13.9697C12.7817 14.8878 12.0702 15.6199 11.1553 15.748C9.39359 15.9946 7.60608 15.9946 5.84435 15.748C4.92951 15.6199 4.21796 14.8878 4.11595 13.9697L4.10199 13.8441C3.845 11.5312 3.845 9.19689 4.10199 6.88395L4.24376 5.608ZM5.24726 6.19792L5.15799 7.00129C4.90966 9.23624 4.90966 11.4918 5.15799 13.7268L5.17195 13.8524C5.22033 14.2878 5.55779 14.635 5.99166 14.6958C7.65566 14.9287 9.34401 14.9287 11.008 14.6958C11.4419 14.635 11.7793 14.2878 11.8277 13.8524L11.8417 13.7268C12.09 11.4918 12.09 9.23624 11.8417 7.00129L11.7524 6.19792H5.24726Z'
                fill='#C80000'
              />
            </svg>
          </button>
        </div>
      </div>
      <form className='mt-7'>
        <div
          className=' flex flex-row justify-between rounded px-5 py-2'
          style={{
            height: '37px',
            border: '0.3px solid rgba(6, 83, 234, 0.4)',
          }}
        >
          <p>
            DOES YOUR DRONE BROADCAST{' '}
            <span>
              <a href='' className='font-semibold text-dark-blue underline'>
                FAA REMOTE ID
              </a>
            </span>{' '}
            INFORMATION?*
          </p>
          <div className='flex flex-row items-center gap-8'>
            <div className='flex flex-row items-center gap-2'>
              <label className='cursor-pointer'>Yes</label>
              <input
                type='radio'
                id='yes'
                name='broadcast'
                className='cursor-pointer'
              />
            </div>
            <div className='flex flex-row items-center gap-2'>
              <label className='cursor-pointer'>No</label>
              <input
                type='radio'
                id='no'
                name='broadcast'
                className='cursor-pointer'
              />
            </div>
          </div>
        </div>
        <p className='mt-2.5 text-sm font-semibold text-light-brown'>
          Not sure? Contact your UAS manufacturer or see if your drone is listed{' '}
          <span>
            {' '}
            <a
              href='https://uasdoc.faa.gov/listDocs'
              target='_blank'
              className='text-dark-blue underline'
            >
              here
            </a>{' '}
          </span>{' '}
        </p>
        <div className='flex flex-row items-center justify-between'>
          <div className='mt-7'>
            <label htmlFor='nickname' className='font-medium text-light-brown'>
              UAV Nickname*
            </label>{' '}
            <br />
            <input
              type='text'
              name='nickname'
              id='nickname'
              defaultValue='Air Drone'
              className='mt-2.5 rounded ps-5 focus:outline-blue-200'
              style={{
                width: '383px',
                height: '37px',
                border: '0.3px solid rgba(6, 83, 234, 0.4)',
              }}
            />
          </div>
          <div
            className=' flex flex-row items-center justify-between rounded pe-2 ps-4'
            style={{
              height: '37px',
              width: ' 383px',
              border: '0.3px solid rgba(6, 83, 234, 0.4)',
              marginTop: '61px',
            }}
          >
            <p>UAV Type</p>
            <select
              defaultValue='Select a device type'
              className='border-collapse rounded-sm bg-sky-blue-100 outline-none outline-0'
              style={{ width: '250px', height: '29px' }}
            >
              <option disabled>Select a device type</option>
            </select>
          </div>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <div className='mt-7'>
            <label
              htmlFor='manufacturer'
              className='font-medium text-light-brown'
            >
              UAV Manufacturer*
            </label>{' '}
            <br />
            <input
              type='text'
              name='manufacturer'
              id='manufacturer'
              defaultValue='DJI'
              className='mt-2.5 rounded ps-5 focus:outline-blue-200'
              style={{
                width: '383px',
                height: '37px',
                border: '0.3px solid rgba(6, 83, 234, 0.4)',
              }}
            />
          </div>
          <div className='mt-7'>
            <label htmlFor='model' className='font-medium text-light-brown'>
              UAV Model*
            </label>{' '}
            <br />
            <input
              type='text'
              name='model'
              id='model'
              defaultValue='CX0007TY'
              className='mt-2.5 rounded ps-5 focus:outline-blue-200'
              style={{
                width: '383px',
                height: '37px',
                border: '0.3px solid rgba(6, 83, 234, 0.4)',
              }}
            />
          </div>
        </div>
        <div className='flex flex-row items-center gap-16'>
          <div className='mt-7'>
            <label
              htmlFor='serial number'
              className='font-medium text-light-brown'
            >
              Serial Number*
            </label>{' '}
            <br />
            <input
              type='text'
              name='serial number'
              id='serial number'
              defaultValue='S475635RDT54'
              className='mt-2.5 rounded ps-5 focus:outline-blue-200'
              style={{
                width: '383px',
                height: '37px',
                border: '0.3px solid rgba(6, 83, 234, 0.4)',
              }}
            />
          </div>
          <div className='mt-20 flex flex-row-reverse items-center justify-start gap-2'>
            <label
              htmlFor='battery range'
              className='cursor-pointer text-sml font-medium text-dark-brown'
            >
              SERIAL NUMBER NOT APLICABLE
            </label>{' '}
            <br />
            <input type='checkbox' className='cursor-pointer ps-2' />
          </div>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <div className='mt-7'>
            <label htmlFor='range' className='font-medium text-light-brown'>
              Range*
            </label>{' '}
            <br />
            <input
              type='text'
              name='range'
              id='range'
              defaultValue='27 KM'
              className='mt-2.5 rounded ps-5 focus:outline-blue-200'
              style={{
                width: '383px',
                height: '37px',
                border: '0.3px solid rgba(6, 83, 234, 0.4)',
              }}
            />
          </div>
          <div className='mt-7'>
            <label
              htmlFor='battery range'
              className='font-medium text-light-brown'
            >
              Battery Range*
            </label>{' '}
            <br />
            <input
              type='text'
              name='battery range'
              id='battery range'
              defaultValue='45 mins'
              className='mt-2.5 rounded ps-5 focus:outline-blue-200'
              style={{
                width: '383px',
                height: '37px',
                border: '0.3px solid rgba(6, 83, 234, 0.4)',
              }}
            />
          </div>
        </div>
        <div className='mt-12 flex flex-row items-center justify-center gap-5'>
          <button
            className='rounded-md text-sml text-dark-blue transition-all duration-500 ease-in-out hover:bg-bleach-blue'
            style={{
              border: '1px solid #0653EA',
              width: '120px',
              height: '40px',
            }}
            onClick={props.onClose}
          >
            Cancel
          </button>
          <button
            className='rounded-md bg-dark-blue text-sml text-white transition-all duration-500 ease-in-out hover:bg-blue-600'
            style={{ width: '120px', height: '40px' }}
          >
            Edit UAV
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUavModal;
