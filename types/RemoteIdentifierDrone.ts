export interface JsonObject {
    id: string;
    remoteData: RemoteData;
    createdAt: Date;
    updatedAt: Date;
  }
export type Coordinates = {
    longitude: number;
    latitude: number;
  };

  export type LatLngPair = [number, number];
  
  export interface RemoteData {
    selfId: {
      descriptionType: string;
      operationDescription: number[];
    };
    system: {
      category: string;
      areaCount: number;
      areaFloor: number;
      areaRadius: number;
      classValue: string;
      areaCeiling: number;
      systemTimestamp: number;
      operatorLatitude: number;
      operatorLongitude: number;
      classificationType: string;
      operatorAltitudeGeo: number;
      operatorLocationType: string;
    };
    location: {
      height: number;
      status: string;
      distance: number;
      flightPath?:LatLngPair[];
      latitude: number;
      direction: number;
      longitude: number;
      heightType: string;
      baroAccuracy: string;
      timeAccuracy: number;
      speedAccuracy: string;
      speedVertical: number;
      speedHorizontal: number;
      altitudeGeodetic: number;
      altitudePressure: number;
      verticalAccuracy: string;
      locationTimestamp: number;
      horizontalAccuracy: string;
    };
    id1Shadow: {
      uasId: number[];
      idType: string;
      uaType: string;
    };
    id2Shadow: {
      uasId: number[];
      idType: string;
      uaType: string;
    };
    connection: {
      rssi: number;
      lastSeen: number;
      msgDelta: number;
      firstSeen: number;
      macAddress: string;
      transportType: string;
    };
    macAddress: string;
    operatorId: {
      operatorId: number[];
      operatorIdType: number;
    };
    authentication: {
      authData: number[];
      authType: string;
      authLength: number;
      authDataPage: number;
      authTimestamp: number;
      authLastPageIndex: number;
    };
    identification1: {
      uasId: number[];
      idType: string;
      uaType: string;
    };
    identification2: {
      uasId: number[];
      idType: string;
      uaType: string;
    };
  }
  