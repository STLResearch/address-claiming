import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';

import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';

import { Web3Auth } from '@web3auth/modal';
import Script from 'next/script';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
const BN = require('bn.js');
const umi = createUmi('https://api.mainnet-beta.solana.com');

import { Web3AuthNoModal } from '@web3auth/no-modal';
import { SolanaPrivateKeyProvider } from '@web3auth/solana-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { WALLET_ADAPTERS } from '@web3auth/base';
import { SolanaWallet } from '@web3auth/solana-provider';

import { counterActions } from '@/store/store';





import { MPL_BUBBLEGUM_PROGRAM_ID, TokenProgramVersion, TokenStandard, getMetadataArgsSerializer, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
umi.use(mplBubblegum());
//umi.use(TokenProgramVersion());


import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';

import Spinner from '@/Components/Spinner';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PublicKey } from '@solana/web3.js';
import geojson1 from '@/Components/static/savedGeojson';


const Rental_Airspace = () => {
  const url = process.env.NEXT_PUBLIC_SOLANA_API;

  const router = useRouter();
  
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState('');
  const [city, setcity] = useState('')


 
  let handleCityChange=async(e)=>{

    setcity(e.target.value)
  }
 
  const { user: selectorUser } = useAuth();
 


  useEffect(() => {
    if (selectorUser) {
      const authUser = async () => {
        const chainConfig = {
          chainNamespace: 'solana',
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID, // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: `Solana ${process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME}` ,
          blockExplorer: 'https://explorer.solana.com',
          ticker: 'SOL',
          tickerName: 'Solana',
        };
        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          chainConfig: chainConfig,
        });
        await web3auth.initModal();
        // await web3auth.connect();
        let userInfo;
        try {
          userInfo = await web3auth.getUserInfo();
        } catch (err) {
          localStorage.removeItem('openlogin_store');
          swal({
            title: 'oops!',
            text: 'Something went wrong. Kindly try again',
          }).then(() => router.push('/auth/join'));
          return;
        }

        const fetchedToken = JSON.parse(
          localStorage.getItem('openlogin_store')
        );

        if (!selectorUser) {
          localStorage.removeItem('openlogin_store');
          router.push('/auth/join');
          return;
        }

        setToken(fetchedToken.sessionId);
        setUser(selectorUser);
      };
      authUser();
    }
  }, [selectorUser]);
useEffect(() => {
    if (token && user && !map) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

      const newMap = new mapboxgl.Map({
        container: 'map1',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.42, 37.779],
        zoom: 5,
      });

      newMap.on('load',()=>{
          newMap.addSource('places',{
            'type':'geojson',
              'data':geojson1
            
          })
          newMap.addLayer({
            'id': 'places',
            'type': 'symbol',
            'source': 'places',
            'layout': {
            'icon-image': ['get', 'icon'],
            'icon-allow-overlap': true
            }
            });


      })
      setMap(newMap);
      
        

      

    
      console.log("1")
      

      
    }
  }, [user]);


  useEffect(()=>{
    if(map){
      map.on('click', 'places', (e) => {
        console.log("clicked")

        if(e.features[0].geometry){
          const coordinates = e.features[0].geometry.coordinates.slice();
       
         
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML('<h1>hello</h1>')
        .addTo(map);
        }
        // Copy coordinates array.
        
        });

        map.on('mouseenter', 'places', () => {
          map.getCanvas().style.cursor = 'pointer';
          });
           
          // Change it back to a pointer when it leaves.
          map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
          });


    }


  },[map])


  useEffect(() => {
    console.log(map)
   
      
      console.log("2")
        
        
          
            if(map){
              for (const feature of geojson1.features) {
                console.log("marking")

               if(feature.geometry) {let el = document.createElement('div');
               
                el.id = 'markerWithExternalCss';
    
                // Add the new marker to the map and update the marker state
                 new maplibregl.Marker(el)
                  .setLngLat(feature.geometry.coordinates)
                  .addTo(map);
               }
              
        } 
            }
    
        
    
  }, [ map]);




  if (!user || !token) {
    return <Spinner />;
  }
console.log(selectorUser)





  return (
    <Fragment>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5' />
      <Script id='google-analytics'>
        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-C0J4J56QW5');
            `}
      </Script>

      
      
      
      
      
      <div className='flex flex-row'>
        <Sidebar user={user} />
        <div
          style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
          className='overflow-y-auto overflow-x-hidden'
        >
          <Navbar
            name={user.name}
            categoryId={user.categoryId}
            // status={user.KYCStatusId}
          />

          <div
            className='relative mt-0'
            id='map1'
            style={{
              width: 'calc(100vw - 257px)',
              height: '100vh',
              marginTop: '0',
            }}
          >
          
            

           
          </div>
          
          







          
          
          
          
          
        </div>
      </div>
    </Fragment>
  );
};

export default Rental_Airspace;
