import { useEffect } from 'react';
import io from 'socket.io-client';

const useDroneSocket = (
  map,
  boundingBox,
  droneId,
  setBoundingBox,
  setSocketDatas,
  setDroneDataSelected,
  setIsLoading,
) => {
  useEffect(() => {
    if (!map) return;

    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      const boundingBoxTemp = {
        minLatitude: bounds.getSouth(),
        maxLatitude: bounds.getNorth(),
        minLongitude: bounds.getWest(),
        maxLongitude: bounds.getEast(),
      };
      setBoundingBox(boundingBoxTemp);
    };

    map.on("moveend", handleMoveEnd);

    try {
      const socket = io(SOCKET_SERVER_URL);

      const handleBoundingBoxResponse = (data) => {
        setSocketDatas(data);
      };

      const handleDroneIdResponse = (data) => {
        setDroneDataSelected(data);
        setIsLoading(false);
      };

      socket.on("boundingBoxResponse", handleBoundingBoxResponse);
      socket.on("droneIdResponse", handleDroneIdResponse);

      if (boundingBox != undefined) {
        socket.emit("sendMessageByBoundingBox", boundingBox);
      }

      if (droneId) {
        socket.emit("sendMessageByDroneId", droneId);
      }

      return () => {
        map.off("moveend", handleMoveEnd);
        socket.disconnect();
      };
    } catch (error) {
      console.error("Error in useDroneSocket:", error);
      setIsLoading(false);
    }
  }, [map, boundingBox, droneId, setBoundingBox, setSocketDatas, setDroneDataSelected, setIsLoading]);
};


export default useDroneSocket;
