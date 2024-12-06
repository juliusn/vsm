'use client';

import { createContext, Dispatch, useContext, useReducer } from 'react';

export enum ActionTypes {
  UPDATE_LOCATION_ENABLED = 'UPDATE_LOCATION_ENABLED',
  UPDATE_PORT_AREA_ENABLED = 'UPDATE_PORT_AREA_ENABLED',
  UPDATE_BERTH_ENABLED = 'UPDATE_BERTH_ENABLED',
  UPDATE_SERVICE_ENABLED = 'UPDATE_SERVICE_ENABLED',
  REMOVE_SERVICE = 'REMOVE_SERVICE',
  UPDATE_SERVICE = 'UPDATE_SERVICE',
  INSERT_SERVICE = 'INSERT_SERVICE',
}

type UpdateLocationEnabled = {
  type: ActionTypes.UPDATE_LOCATION_ENABLED;
  payload: { enabled: boolean };
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

type UpdateServiceEnabled = {
  type: ActionTypes.UPDATE_SERVICE_ENABLED;
  payload: {
    id: string;
    enabled: boolean;
  };
};

type RemoveService = {
  type: ActionTypes.REMOVE_SERVICE;
  payload: {
    id: string;
  };
};

type UpdateService = {
  type: ActionTypes.UPDATE_SERVICE;
  payload: {
    service: AppTypes.BerthService;
  };
};

type InsertService = {
  type: ActionTypes.INSERT_SERVICE;
  payload: {
    service: AppTypes.BerthService;
  };
};

type State = {
  location: AppTypes.Location;
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
  berthServices: AppTypes.BerthService[];
};

type Actions =
  | UpdateLocationEnabled
  | UpdatePortAreaEnabled
  | UpdateBerthEnabled
  | UpdateServiceEnabled
  | RemoveService
  | UpdateService
  | InsertService;

type LocationContextType = {
  state: State;
  dispatch: Dispatch<Actions>;
};

const LocationContext = createContext<LocationContextType | null>(null);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(`useLocation must be used within a LocationProvider.`);
  }
  return context;
};

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case ActionTypes.UPDATE_LOCATION_ENABLED: {
      return {
        ...state,
        location: { ...state.location, enabled: action.payload.enabled },
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

    case ActionTypes.UPDATE_SERVICE_ENABLED: {
      return {
        ...state,
        berthServices: state.berthServices.map((service) =>
          service.id === action.payload.id
            ? { ...service, enabled: action.payload.enabled }
            : service
        ),
      };
    }

    case ActionTypes.REMOVE_SERVICE: {
      return {
        ...state,
        berthServices: state.berthServices.filter(
          (service) => service.id !== action.payload.id
        ),
      };
    }

    case ActionTypes.UPDATE_SERVICE: {
      return {
        ...state,
        berthServices: state.berthServices.map((service) =>
          service.id === action.payload.service.id
            ? { ...action.payload.service }
            : service
        ),
      };
    }

    case ActionTypes.INSERT_SERVICE: {
      return {
        ...state,
        berthServices: [...state.berthServices, action.payload.service],
      };
    }
  }
};

export const LocationProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: State;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LocationContext.Provider value={{ state, dispatch }}>
      {children}
    </LocationContext.Provider>
  );
};
