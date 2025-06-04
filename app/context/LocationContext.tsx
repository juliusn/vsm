'use client';

import { createContext, Dispatch, useContext, useReducer } from 'react';

export type LocationState = {
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
};

export enum ActionTypes {
  UPDATE_LOCATION_ENABLED = 'UPDATE_LOCATION_ENABLED',
  UPDATE_PORT_AREA_ENABLED = 'UPDATE_PORT_AREA_ENABLED',
  UPDATE_BERTH_ENABLED = 'UPDATE_BERTH_ENABLED',
}

type UpdateLocationEnabled = {
  type: ActionTypes.UPDATE_LOCATION_ENABLED;
  payload: { locode: string; enabled: boolean };
};

type UpdatePortAreaEnabled = {
  type: ActionTypes.UPDATE_PORT_AREA_ENABLED;
  payload: { locode: string; portAreaCode: string; enabled: boolean };
};

type UpdateBerthEnabled = {
  type: ActionTypes.UPDATE_BERTH_ENABLED;
  payload: {
    locode: string;
    portAreaCode: string;
    berthCode: string;
    enabled: boolean;
  };
};

type Actions =
  | UpdateLocationEnabled
  | UpdatePortAreaEnabled
  | UpdateBerthEnabled;

type LocationContextType = {
  state: LocationState;
  dispatch: Dispatch<Actions>;
};

const LocationContext = createContext<LocationContextType | null>(null);

const reducer = (state: LocationState, action: Actions): LocationState => {
  switch (action.type) {
    case ActionTypes.UPDATE_LOCATION_ENABLED: {
      return {
        ...state,
        locations: state.locations.map((location) =>
          location.locode === action.payload.locode
            ? { ...location, enabled: action.payload.enabled }
            : location
        ),
      };
    }

    case ActionTypes.UPDATE_PORT_AREA_ENABLED: {
      return {
        ...state,
        portAreas: state.portAreas.map((portArea) =>
          portArea.locode === action.payload.locode &&
          portArea.port_area_code === action.payload.portAreaCode
            ? { ...portArea, enabled: action.payload.enabled }
            : portArea
        ),
      };
    }

    case ActionTypes.UPDATE_BERTH_ENABLED: {
      return {
        ...state,
        berths: state.berths.map((berth) =>
          berth.locode === action.payload.locode &&
          berth.port_area_code === action.payload.portAreaCode &&
          berth.berth_code === action.payload.berthCode
            ? { ...berth, enabled: action.payload.enabled }
            : berth
        ),
      };
    }
  }
};

type LocationProviderProps = {
  children: React.ReactNode;
  initialState: LocationState;
};

export const LocationProvider = ({
  children,
  initialState,
}: LocationProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <LocationContext.Provider value={{ state, dispatch }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocations must be used within LocationProvider.');
  }

  return context;
};
