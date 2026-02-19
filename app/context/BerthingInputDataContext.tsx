'use client';

import { BerthIdentifier, PortAreaIdentifier } from '@/lib/types/berthing';
import { Berthing } from '@/lib/types/query-types';
import { Vessel } from '@/lib/types/vessel';
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from 'react';
import { useVessels } from './VesselContext';

interface ContextType {
  berthingVessel: Vessel | null;
  selectedVessel: Vessel | null;
  setSelectedVessel: Dispatch<SetStateAction<Vessel | null>>;
  arrivalLocode: string | null;
  setArrivalLocode: Dispatch<SetStateAction<string | null>>;
  arrivalPortArea: string | null;
  setArrivalPortArea: Dispatch<SetStateAction<string | null>>;
  arrivalPortAreaIdentifier: PortAreaIdentifier | null;
  arrivalBerthIdentifier: BerthIdentifier | null;
  departureLocode: string | null;
  setDepartureLocode: Dispatch<SetStateAction<string | null>>;
  departurePortArea: string | null;
  setDeparturePortArea: Dispatch<SetStateAction<string | null>>;
  departurePortAreaIdentifier: PortAreaIdentifier | null;
  departureBerthIdentifier: BerthIdentifier | null;
  imoInputRef: RefObject<HTMLInputElement | null>;
}

const Context = createContext<ContextType | null>(null);

export function BerthingInputDataProvider({
  selectedBerthing,
  children,
}: {
  selectedBerthing?: Berthing;
  children: React.ReactNode;
}) {
  const vessels = useVessels();

  const berthingVessel =
    vessels.find((vessel) => vessel.imo === selectedBerthing?.vessel_imo) ||
    null;

  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(
    berthingVessel || null
  );

  const [arrivalLocode, setArrivalLocode] = useState(
    selectedBerthing?.arrival?.locode || null
  );

  const arrivalPortAreaIdentifier: PortAreaIdentifier | null =
    selectedBerthing?.arrival?.locode && selectedBerthing.arrival.port_area_code
      ? {
          locode: selectedBerthing.arrival.locode,
          port_area_code: selectedBerthing.arrival.port_area_code,
        }
      : null;

  const arrivalBerthIdentifier: BerthIdentifier | null =
    selectedBerthing?.arrival?.locode &&
    selectedBerthing.arrival.port_area_code &&
    selectedBerthing.arrival.berth_code
      ? {
          locode: selectedBerthing.arrival.locode,
          port_area_code: selectedBerthing.arrival.port_area_code,
          berth_code: selectedBerthing.arrival.berth_code,
        }
      : null;

  const [arrivalPortArea, setArrivalPortArea] = useState<string | null>(
    arrivalPortAreaIdentifier ? JSON.stringify(arrivalPortAreaIdentifier) : null
  );

  const [departureLocode, setDepartureLocode] = useState<string | null>(
    selectedBerthing?.departure?.locode || null
  );

  const departurePortAreaIdentifier: PortAreaIdentifier | null =
    selectedBerthing?.departure?.locode &&
    selectedBerthing.departure.port_area_code
      ? {
          locode: selectedBerthing.departure.locode,
          port_area_code: selectedBerthing.departure.port_area_code,
        }
      : null;

  const departureBerthIdentifier: BerthIdentifier | null =
    selectedBerthing?.departure?.locode &&
    selectedBerthing.departure.port_area_code &&
    selectedBerthing.departure.berth_code
      ? {
          locode: selectedBerthing.departure.locode,
          port_area_code: selectedBerthing.departure.port_area_code,
          berth_code: selectedBerthing.departure.berth_code,
        }
      : null;

  const [departurePortArea, setDeparturePortArea] = useState<string | null>(
    departurePortAreaIdentifier
      ? JSON.stringify(departurePortAreaIdentifier)
      : null
  );

  const imoInputRef = useRef<HTMLInputElement>(null);

  return (
    <Context.Provider
      value={{
        berthingVessel,
        selectedVessel,
        setSelectedVessel,
        arrivalLocode,
        setArrivalLocode,
        arrivalPortArea,
        setArrivalPortArea,
        arrivalPortAreaIdentifier,
        arrivalBerthIdentifier,
        departureLocode,
        setDepartureLocode,
        departurePortArea,
        setDeparturePortArea,
        departurePortAreaIdentifier,
        departureBerthIdentifier,
        imoInputRef,
      }}>
      {children}
    </Context.Provider>
  );
}

export function useBerthingInputData() {
  const context = useContext(Context);

  if (!context) {
    throw `useBerthingInputData must be used within BerthingInputDataProvider`;
  }

  return context;
}
