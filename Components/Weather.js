

import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';

import useAuth from '@/hooks/useAuth';

const Weather = () => {

  const { user } = useAuth();

  return (
    <div className='flex w-screen flex-row'>
      <Sidebar />
      <div
        style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
        className='overflow-y-auto'
      >
        <Navbar name={user?.name} />
        <div className='flex flex-row justify-center'>
          <div
            className='mx-5 my-5 rounded bg-white p-5'
            style={{ height: '893px', maxWidth: '339px' }}
          >
            <div className='relative'>
              <p className='mb-0 ms-5'>Kentucky</p>
              <p className='-mt-1 ms-5 text-sm'>United States</p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='absolute left-0 top-1'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M17.1834 7.04232C16.3084 3.19232 12.9501 1.45898 10.0001 1.45898C10.0001 1.45898 10.0001 1.45898 9.99175 1.45898C7.05008 1.45898 3.68341 3.18398 2.80841 7.03398C1.83341 11.334 4.46675 14.9757 6.85008 17.2673C7.73341 18.1173 8.86675 18.5423 10.0001 18.5423C11.1334 18.5423 12.2667 18.1173 13.1417 17.2673C15.5251 14.9757 18.1584 11.3423 17.1834 7.04232ZM10.0001 11.2173C8.55008 11.2173 7.37508 10.0423 7.37508 8.59232C7.37508 7.14232 8.55008 5.96732 10.0001 5.96732C11.4501 5.96732 12.6251 7.14232 12.6251 8.59232C12.6251 10.0423 11.4501 11.2173 10.0001 11.2173Z'
                  fill='#3F3D56'
                />
              </svg>
            </div>
            <div className='mt-20 flex flex-col items-center'>
              <p className='text-sml text-dark-brown'>Today, 4th July</p>
              <p className='font-semibold text-dark-brown'>11:00 pm</p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                style={{ maxWidth: '168px' }}
                width='80%'
                height='168'
                viewBox='0 0 168 168'
                fill='none'
              >
                <path
                  d='M152.18 90.37C150.36 84.35 147.35 79.1 143.36 74.83C138.25 69.02 131.46 65.03 123.83 63.28C119.98 45.78 109.2 33.18 93.87 28.49C77.21 23.31 57.89 28.35 45.78 41.02C35.14 52.15 31.64 67.48 35.77 83.79C21.77 87.22 14.84 98.91 14.07 110.04C14 110.81 14 111.51 14 112.21C14 125.37 22.61 140.14 41.79 141.54H114.45C124.39 141.54 133.91 137.83 141.19 131.18C152.6 121.17 156.8 105.56 152.18 90.37Z'
                  fill='url(#paint0_linear_752_4372)'
                />
                <defs>
                  <linearGradient
                    id='paint0_linear_752_4372'
                    x1='84.0125'
                    y1='26.4766'
                    x2='84.0125'
                    y2='141.54'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F3D56' stop-opacity='0.61' />
                    <stop offset='1' stop-color='#3F3D56' />
                  </linearGradient>
                </defs>
              </svg>
              <p className='font-semibold text-dark-brown'>
                Cloudy, 31<span className='align-super text-xs'>o</span>c
              </p>
            </div>
            <div className='mb-12 mt-8 flex flex-row justify-between gap-10'>
              <div className='flex flex-col items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M15.4165 18.9583C13.4665 18.9583 11.8748 17.3667 11.8748 15.4167V15C11.8748 14.6583 12.1582 14.375 12.4998 14.375C12.8415 14.375 13.1248 14.6583 13.1248 15V15.4167C13.1248 16.6833 14.1498 17.7083 15.4165 17.7083C16.6832 17.7083 17.7082 16.6833 17.7082 15.4167C17.7082 14.15 16.6832 13.125 15.4165 13.125H1.6665C1.32484 13.125 1.0415 12.8417 1.0415 12.5C1.0415 12.1583 1.32484 11.875 1.6665 11.875H15.4165C17.3665 11.875 18.9582 13.4667 18.9582 15.4167C18.9582 17.3667 17.3665 18.9583 15.4165 18.9583Z'
                    fill='#0653EA'
                  />
                  <path
                    d='M15.4165 10.6243H1.6665C1.32484 10.6243 1.0415 10.341 1.0415 9.99935C1.0415 9.65768 1.32484 9.37435 1.6665 9.37435H15.4165C16.6832 9.37435 17.7082 8.34935 17.7082 7.08268C17.7082 5.81602 16.6832 4.79102 15.4165 4.79102C14.1498 4.79102 13.1248 5.81602 13.1248 7.08268V7.49935C13.1248 7.84102 12.8415 8.12435 12.4998 8.12435C12.1582 8.12435 11.8748 7.84102 11.8748 7.49935V7.08268C11.8748 5.13268 13.4665 3.54102 15.4165 3.54102C17.3665 3.54102 18.9582 5.13268 18.9582 7.08268C18.9582 9.03268 17.3665 10.6243 15.4165 10.6243Z'
                    fill='#0653EA'
                  />
                  <path
                    d='M7.75817 8.12591H1.6665C1.32484 8.12591 1.0415 7.84258 1.0415 7.50091C1.0415 7.15925 1.32484 6.87591 1.6665 6.87591H7.75817C8.64984 6.87591 9.37484 6.15091 9.37484 5.25924C9.37484 4.36758 8.64984 3.64258 7.75817 3.64258C6.8665 3.64258 6.1415 4.36758 6.1415 5.25924V5.57591C6.1415 5.91758 5.85817 6.20091 5.5165 6.20091C5.17483 6.20091 4.8915 5.91758 4.8915 5.57591V5.25924C4.8915 3.67591 6.17484 2.39258 7.75817 2.39258C9.3415 2.39258 10.6248 3.67591 10.6248 5.25924C10.6248 6.84258 9.3415 8.12591 7.75817 8.12591Z'
                    fill='#0653EA'
                  />
                </svg>
                <p className='font-semibold text-dark-brown'>6 km/h</p>
                <p className='text-sm text-dark-brown'>Wind</p>
              </div>
              <div className='flex flex-col items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M10.5084 1.84102C10.2084 1.60768 9.79174 1.60768 9.49174 1.84102C7.90841 3.04935 3.2334 6.99101 3.2584 11.5827C3.2584 15.2993 6.28341 18.3327 10.0084 18.3327C13.7334 18.3327 16.7584 15.3077 16.7584 11.591C16.7667 7.06602 12.0834 3.05768 10.5084 1.84102Z'
                    stroke='#0653EA'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                  />
                </svg>
                <p className='font-semibold text-dark-brown'>16 %</p>
                <p className='text-sm text-dark-brown'>Humidity</p>
              </div>
              <div className='flex flex-col items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M12.9833 10.0009C12.9833 11.6509 11.6499 12.9842 9.99993 12.9842C8.34993 12.9842 7.0166 11.6509 7.0166 10.0009C7.0166 8.35091 8.34993 7.01758 9.99993 7.01758C11.6499 7.01758 12.9833 8.35091 12.9833 10.0009Z'
                    stroke='#0653EA'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9.99987 16.8913C12.9415 16.8913 15.6832 15.1579 17.5915 12.1579C18.3415 10.9829 18.3415 9.00794 17.5915 7.83294C15.6832 4.83294 12.9415 3.09961 9.99987 3.09961C7.0582 3.09961 4.31654 4.83294 2.4082 7.83294C1.6582 9.00794 1.6582 10.9829 2.4082 12.1579C4.31654 15.1579 7.0582 16.8913 9.99987 16.8913Z'
                    stroke='#0653EA'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <p className='font-semibold text-dark-brown'>1.4 km</p>
                <p className='text-sm text-dark-brown'>Visibility</p>
              </div>
            </div>
            <div
              className='rounded bg-light-brown'
              style={{ maxWidth: '299px', height: '310px' }}
            ></div>
          </div>
          <div
            className='mx-5 my-5 rounded bg-white p-5'
            style={{ height: '893px', maxWidth: '784px' }}
          >
            <p className='mb-5'>Weekly Weather</p>
            <div className='grid gap-3 md:grid-cols-5 lg:grid-cols-7'>
              <div
                className='flex flex-col items-center justify-center rounded-md'
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(63, 61, 86, 0.85) 0%, rgba(63, 61, 86, 0.95) 100%)',
                  height: '136px',
                  minWidth: '80px',
                  maxWidth: '136px',
                }}
              >
                <p className='text-white'>Sun</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <path
                    d='M45.2915 26.8968C44.7498 25.1051 43.854 23.5426 42.6665 22.2718C41.1457 20.5426 39.1248 19.3551 36.854 18.8343C35.7082 13.6259 32.4998 9.87593 27.9373 8.4801C22.979 6.93843 17.229 8.43843 13.6248 12.2093C10.4582 15.5218 9.4165 20.0843 10.6457 24.9384C6.479 25.9593 4.4165 29.4384 4.18734 32.7509C4.1665 32.9801 4.1665 33.1884 4.1665 33.3968C4.1665 37.3134 6.729 41.7093 12.4373 42.1259H34.0623C37.0207 42.1259 39.854 41.0218 42.0207 39.0426C45.4165 36.0634 46.6665 31.4176 45.2915 26.8968Z'
                    fill='url(#paint0_radial_756_4795)'
                  />
                  <defs>
                    <radialGradient
                      id='paint0_radial_756_4795'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0036 25.0034) rotate(90) scale(17.1225 20.8371)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                  </defs>
                </svg>
                <p className='text-sml text-white'>
                  31<span className='align-super text-xs'>o</span>c
                </p>
              </div>
              <div
                className='flex flex-col items-center justify-center rounded-md'
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(63, 61, 86, 0.85) 0%, rgba(63, 61, 86, 0.95) 100%)',
                  height: '136px',
                  minWidth: '80px',
                  maxWidth: '136px',
                }}
              >
                <p className='text-white'>Mon</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <path
                    d='M45.2915 26.8968C44.7498 25.1051 43.854 23.5426 42.6665 22.2718C41.1457 20.5426 39.1248 19.3551 36.854 18.8343C35.7082 13.6259 32.4998 9.87593 27.9373 8.4801C22.979 6.93843 17.229 8.43843 13.6248 12.2093C10.4582 15.5218 9.4165 20.0843 10.6457 24.9384C6.479 25.9593 4.4165 29.4384 4.18734 32.7509C4.1665 32.9801 4.1665 33.1884 4.1665 33.3968C4.1665 37.3134 6.729 41.7093 12.4373 42.1259H34.0623C37.0207 42.1259 39.854 41.0218 42.0207 39.0426C45.4165 36.0634 46.6665 31.4176 45.2915 26.8968Z'
                    fill='url(#paint0_radial_756_4795)'
                  />
                  <defs>
                    <radialGradient
                      id='paint0_radial_756_4795'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0036 25.0034) rotate(90) scale(17.1225 20.8371)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                  </defs>
                </svg>
                <p className='text-sml text-white'>
                  31<span className='align-super text-xs'>o</span>c
                </p>
              </div>
              <div
                className='flex flex-col items-center justify-center rounded-md'
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(63, 61, 86, 0.85) 0%, rgba(63, 61, 86, 0.95) 100%)',
                  height: '136px',
                  minWidth: '80px',
                  maxWidth: '136px',
                }}
              >
                <p className='text-white'>Tue</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <path
                    d='M45.2915 26.8968C44.7498 25.1051 43.854 23.5426 42.6665 22.2718C41.1457 20.5426 39.1248 19.3551 36.854 18.8343C35.7082 13.6259 32.4998 9.87593 27.9373 8.4801C22.979 6.93843 17.229 8.43843 13.6248 12.2093C10.4582 15.5218 9.4165 20.0843 10.6457 24.9384C6.479 25.9593 4.4165 29.4384 4.18734 32.7509C4.1665 32.9801 4.1665 33.1884 4.1665 33.3968C4.1665 37.3134 6.729 41.7093 12.4373 42.1259H34.0623C37.0207 42.1259 39.854 41.0218 42.0207 39.0426C45.4165 36.0634 46.6665 31.4176 45.2915 26.8968Z'
                    fill='url(#paint0_radial_756_4795)'
                  />
                  <defs>
                    <radialGradient
                      id='paint0_radial_756_4795'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0036 25.0034) rotate(90) scale(17.1225 20.8371)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                  </defs>
                </svg>
                <p className='text-sml text-white'>
                  31<span className='align-super text-xs'>o</span>c
                </p>
              </div>
              <div
                className='flex flex-col items-center justify-center rounded-md'
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(63, 61, 86, 0.85) 0%, rgba(63, 61, 86, 0.95) 100%)',
                  height: '136px',
                  minWidth: '80px',
                  maxWidth: '136px',
                }}
              >
                <p className='text-white'>Wed</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <path
                    d='M45.2915 26.8968C44.7498 25.1051 43.854 23.5426 42.6665 22.2718C41.1457 20.5426 39.1248 19.3551 36.854 18.8343C35.7082 13.6259 32.4998 9.87593 27.9373 8.4801C22.979 6.93843 17.229 8.43843 13.6248 12.2093C10.4582 15.5218 9.4165 20.0843 10.6457 24.9384C6.479 25.9593 4.4165 29.4384 4.18734 32.7509C4.1665 32.9801 4.1665 33.1884 4.1665 33.3968C4.1665 37.3134 6.729 41.7093 12.4373 42.1259H34.0623C37.0207 42.1259 39.854 41.0218 42.0207 39.0426C45.4165 36.0634 46.6665 31.4176 45.2915 26.8968Z'
                    fill='url(#paint0_radial_756_4795)'
                  />
                  <defs>
                    <radialGradient
                      id='paint0_radial_756_4795'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0036 25.0034) rotate(90) scale(17.1225 20.8371)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                  </defs>
                </svg>
                <p className='text-sml text-white'>
                  31<span className='align-super text-xs'>o</span>c
                </p>
              </div>
              <div
                className='flex flex-col items-center justify-center rounded-md'
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(63, 61, 86, 0.85) 0%, rgba(63, 61, 86, 0.95) 100%)',
                  height: '136px',
                  minWidth: '80px',
                  maxWidth: '136px',
                }}
              >
                <p className='text-white'>Thu</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <path
                    d='M45.2915 26.8968C44.7498 25.1051 43.854 23.5426 42.6665 22.2718C41.1457 20.5426 39.1248 19.3551 36.854 18.8343C35.7082 13.6259 32.4998 9.87593 27.9373 8.4801C22.979 6.93843 17.229 8.43843 13.6248 12.2093C10.4582 15.5218 9.4165 20.0843 10.6457 24.9384C6.479 25.9593 4.4165 29.4384 4.18734 32.7509C4.1665 32.9801 4.1665 33.1884 4.1665 33.3968C4.1665 37.3134 6.729 41.7093 12.4373 42.1259H34.0623C37.0207 42.1259 39.854 41.0218 42.0207 39.0426C45.4165 36.0634 46.6665 31.4176 45.2915 26.8968Z'
                    fill='url(#paint0_radial_756_4795)'
                  />
                  <defs>
                    <radialGradient
                      id='paint0_radial_756_4795'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0036 25.0034) rotate(90) scale(17.1225 20.8371)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                  </defs>
                </svg>
                <p className='text-sml text-white'>
                  31<span className='align-super text-xs'>o</span>c
                </p>
              </div>
              <div
                className='flex flex-col items-center justify-center rounded-md'
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(63, 61, 86, 0.85) 0%, rgba(63, 61, 86, 0.95) 100%)',
                  height: '136px',
                  minWidth: '80px',
                  maxWidth: '136px',
                }}
              >
                <p className='text-white'>Fri</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <path
                    d='M42.0207 36.6051C40.9165 37.6259 39.6457 38.3968 38.2707 38.9176C36.8957 39.4384 35.4165 38.4384 35.4165 36.9593V34.2093C35.4165 30.1468 32.1248 26.8551 28.0623 26.8551H21.9373C17.8748 26.8551 14.5832 30.1468 14.5832 34.2093V37.5009C14.5832 38.6468 13.6457 39.5843 12.4998 39.5843H11.5623C6.45817 38.8134 4.1665 34.6676 4.1665 30.9593C4.1665 27.4593 6.20817 23.5843 10.6457 22.5009C9.4165 17.6468 10.4582 13.0843 13.6248 9.77176C17.229 6.00093 22.979 4.50093 27.9373 6.0426C32.4998 7.43843 35.7082 11.1884 36.854 16.3968C40.8332 17.2926 44.0207 20.2926 45.2915 24.4593C46.6665 28.9801 45.4165 33.6259 42.0207 36.6051Z'
                    fill='url(#paint0_radial_898_3080)'
                  />
                  <path
                    d='M28.0627 29.9785H21.9377C19.2918 29.9785 17.7085 31.5618 17.7085 34.2077V40.3327C17.7085 42.9785 19.2918 44.5618 21.9377 44.5618H28.0627C30.7085 44.5618 32.2918 42.9785 32.2918 40.3327V34.2077C32.2918 31.5618 30.7085 29.9785 28.0627 29.9785ZM28.4793 37.6035L25.0002 41.5618L24.5835 42.041C24.021 42.6868 23.5418 42.5202 23.5418 41.6452V37.9368H21.9585C21.2293 37.9368 21.0418 37.4993 21.521 36.9577L25.0002 32.9993L25.4168 32.5202C25.9793 31.8743 26.4585 32.041 26.4585 32.916V36.6243H28.0418C28.771 36.6035 28.9585 37.0618 28.4793 37.6035Z'
                    fill='url(#paint1_radial_898_3080)'
                  />
                  <defs>
                    <radialGradient
                      id='paint0_radial_898_3080'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0036 22.5138) rotate(90) scale(17.0705 20.8371)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                    <radialGradient
                      id='paint1_radial_898_3080'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0002 37.2702) rotate(90) scale(7.29167 7.29167)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                  </defs>
                </svg>
                <p className='text-sml text-white'>
                  31<span className='align-super text-xs'>o</span>c
                </p>
              </div>
              <div
                className='flex flex-col items-center justify-center rounded-md'
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(63, 61, 86, 0.85) 0%, rgba(63, 61, 86, 0.95) 100%)',
                  height: '136px',
                  minWidth: '80px',
                  maxWidth: '136px',
                }}
              >
                <p className='text-white'>Sat</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <path
                    d='M42.0207 36.6051C40.9165 37.6259 39.6457 38.3968 38.2707 38.9176C36.8957 39.4384 35.4165 38.4384 35.4165 36.9593V34.2093C35.4165 30.1468 32.1248 26.8551 28.0623 26.8551H21.9373C17.8748 26.8551 14.5832 30.1468 14.5832 34.2093V37.5009C14.5832 38.6468 13.6457 39.5843 12.4998 39.5843H11.5623C6.45817 38.8134 4.1665 34.6676 4.1665 30.9593C4.1665 27.4593 6.20817 23.5843 10.6457 22.5009C9.4165 17.6468 10.4582 13.0843 13.6248 9.77176C17.229 6.00093 22.979 4.50093 27.9373 6.0426C32.4998 7.43843 35.7082 11.1884 36.854 16.3968C40.8332 17.2926 44.0207 20.2926 45.2915 24.4593C46.6665 28.9801 45.4165 33.6259 42.0207 36.6051Z'
                    fill='url(#paint0_radial_898_2490)'
                  />
                  <path
                    d='M28.0627 29.9785H21.9377C19.2918 29.9785 17.7085 31.5618 17.7085 34.2077V40.3327C17.7085 42.9785 19.2918 44.5618 21.9377 44.5618H28.0627C30.7085 44.5618 32.2918 42.9785 32.2918 40.3327V34.2077C32.2918 31.5618 30.7085 29.9785 28.0627 29.9785ZM24.396 39.2493L21.8127 41.8118C21.6252 41.9993 21.3752 42.1035 21.146 42.1035C20.8752 42.1035 20.646 41.9993 20.4585 41.8118C20.0835 41.4368 20.0835 40.8327 20.4585 40.4577L23.021 37.8743C23.4168 37.4993 24.021 37.4993 24.396 37.8743C24.771 38.2493 24.771 38.8743 24.396 39.2493ZM24.396 34.0827L21.8127 36.666C21.6252 36.8535 21.3752 36.9577 21.146 36.9577C20.8752 36.9577 20.646 36.8535 20.4585 36.666C20.0835 36.291 20.0835 35.666 20.4585 35.291L23.021 32.7285C23.4168 32.3535 24.021 32.3535 24.396 32.7285C24.771 33.1035 24.771 33.7077 24.396 34.0827ZM29.5418 39.2493L26.9793 41.8118C26.771 41.9993 26.5418 42.1035 26.2918 42.1035C26.0418 42.1035 25.7918 41.9993 25.6043 41.8118C25.2293 41.4368 25.2293 40.8327 25.6043 40.4577L28.1877 37.8743C28.5627 37.4993 29.1668 37.4993 29.5418 37.8743C29.9168 38.2493 29.9168 38.8743 29.5418 39.2493ZM29.5418 34.0827L26.9793 36.666C26.771 36.8535 26.5418 36.9577 26.2918 36.9577C26.0418 36.9577 25.7918 36.8535 25.6043 36.666C25.2293 36.291 25.2293 35.666 25.6043 35.291L28.1877 32.7285C28.5627 32.3535 29.1668 32.3535 29.5418 32.7285C29.9168 33.1035 29.9168 33.7077 29.5418 34.0827Z'
                    fill='url(#paint1_radial_898_2490)'
                  />
                  <defs>
                    <radialGradient
                      id='paint0_radial_898_2490'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0036 22.5138) rotate(90) scale(17.0705 20.8371)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                    <radialGradient
                      id='paint1_radial_898_2490'
                      cx='0'
                      cy='0'
                      r='1'
                      gradientUnits='userSpaceOnUse'
                      gradientTransform='translate(25.0002 37.2702) rotate(90) scale(7.29167 7.29167)'
                    >
                      <stop stop-color='white' />
                      <stop offset='1' stop-color='#C2C2C2' />
                    </radialGradient>
                  </defs>
                </svg>
                <p className='text-sml text-white'>
                  31<span className='align-super text-xs'>o</span>c
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
