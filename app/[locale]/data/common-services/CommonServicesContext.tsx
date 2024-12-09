'use client';

import { createContext, Dispatch, useContext, useReducer } from 'react';

export enum ActionTypes {
  SET_SERVICES = 'SET_SERVICES',
  INSERT_SERVICE = 'INSERT_SERVICE',
  REMOVE_SERVICE = 'REMOVE_SERVICE',
  UPDATE_SERVICE = 'UPDATE_SERVICE',
}

type SetServices = {
  type: ActionTypes.SET_SERVICES;
  payload: { services: AppTypes.CommonService[] };
};

type InsertService = {
  type: ActionTypes.INSERT_SERVICE;
  payload: { service: AppTypes.CommonService };
};

type RemoveService = {
  type: ActionTypes.REMOVE_SERVICE;
  payload: { id: string };
};

type UpdateService = {
  type: ActionTypes.UPDATE_SERVICE;
  payload: { service: AppTypes.CommonService };
};

type Actions = SetServices | InsertService | RemoveService | UpdateService;

type ContextType = {
  services: AppTypes.CommonService[];
  dispatch: Dispatch<Actions>;
};

const reducer = (
  services: AppTypes.CommonService[],
  action: Actions
): AppTypes.CommonService[] => {
  switch (action.type) {
    case ActionTypes.SET_SERVICES: {
      return [...action.payload.services];
    }

    case ActionTypes.INSERT_SERVICE: {
      return [...services, action.payload.service];
    }

    case ActionTypes.REMOVE_SERVICE: {
      return services.filter((service) => service.id !== action.payload.id);
    }

    case ActionTypes.UPDATE_SERVICE: {
      return services.map((service) =>
        service.id === action.payload.service.id
          ? { ...action.payload.service }
          : service
      );
    }
  }
};

const Context = createContext<ContextType | null>(null);

export const CommonServicesProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: AppTypes.CommonService[];
}) => {
  const [services, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ services, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useCommonServices = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      'useCommonServices must be used within CommonServicesProvider.'
    );
  }

  return context;
};
