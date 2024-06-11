import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { JsonObject } from '@/types';
import * as SocketIOClient from 'socket.io-client';
import mapboxgl, { Map, Marker } from "mapbox-gl";

interface BoundingBox {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
}


const useDroneSocket = (
  map: Map | null, 
  boundingBox: BoundingBox | undefined,
  droneId: string | undefined,
  setBoundingBox: React.Dispatch<React.SetStateAction<BoundingBox | undefined>>,
  setSocketDatas: React.Dispatch<React.SetStateAction<JsonObject[] | null>>,
  setDroneDataSelected: React.Dispatch<React.SetStateAction<JsonObject | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  useEffect(() => {
    if (!map) return;

    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      const boundingBoxTemp: BoundingBox = {
        minLatitude: bounds.getSouth(),
        maxLatitude: bounds.getNorth(),
        minLongitude: bounds.getWest(),
        maxLongitude: bounds.getEast(),
      };
      setBoundingBox(boundingBoxTemp);
    };

    map.on('moveend', handleMoveEnd);

    try {
      let socket: SocketIOClient.Socket | null = null;
      if (SOCKET_SERVER_URL) {
       socket = io(SOCKET_SERVER_URL);
      } else {
        console.error("Socket server URL is not defined.");
      }

      const handleBoundingBoxResponse = (data: JsonObject[]) => {
        setSocketDatas(data);
      };

      const handleDroneIdResponse = (data: JsonObject) => {
        setDroneDataSelected(data);
        setIsLoading(false);
      };
      if (socket) {

        (socket as Socket).on('boundingBoxResponse', handleBoundingBoxResponse);
        (socket as Socket).on('droneIdResponse', handleDroneIdResponse);

        if (boundingBox !== undefined) {
          (socket as Socket).emit('sendMessageByBoundingBox', boundingBox);
        }

        if (droneId) {
          (socket as Socket).emit('sendMessageByDroneId', droneId);
        }
      }


      return () => {
        map.off('moveend', handleMoveEnd);
        if (socket) {
          (socket as Socket).disconnect();
        }
      };
    } catch (error) {
      console.error('Error in useDroneSocket:', error);
      setIsLoading(false);
    }
  }, [map, boundingBox, droneId, setBoundingBox, setSocketDatas, setDroneDataSelected, setIsLoading]);
};

export default useDroneSocket;