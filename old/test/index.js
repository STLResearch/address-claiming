import { Fragment, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';

const Test = () => {
    const [map, setMap] = useState(null)

    // GET THE MAP
    useEffect(() => {
        if (!map) {
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

            const newMap = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-15.498211, 28.035056],
                zoom: 20,
            });

            newMap.on('load', function () {
                newMap.addLayer({
                    id: 'maine',
                    type: 'fill',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [],
                            },
                        },
                    },
                    layout: {},
                    paint: {
                        'fill-color': '#D20C0C',
                    },
                });
            });

            setMap(newMap);
        }
    }, []);

    return (
        <Fragment>
            <div className='relative w-screen h-screen flex items-center justify-center'>
                <div
                    className='!w-full !h-full !m-0'
                    id='map'
                />
            </div>
        </Fragment>
    );
}

// import Image from "next/image";

// const Test = () => {
//     return <Image
//         src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${props.longitute},${props.latitude},14,0/300x200?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`}
//         alt='a static map'
//         className='rounded-t-md'
//         width={339}
//         height={422}
//     />
// }

export default Test;