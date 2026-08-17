import { createContext } from "react";

type MyDropdownContextType = {
  buildings: any;
  newTsparam: any;
  mediaopen: any;
  mediatype: any;
  mediapaths: any;
  mediascale: any;
  chartTab: any;
  mediatimestamp: any;
  updateBuildings: any;
  updateNewTsparam: any;
  updateMediaopen: any;
  updateMediatype: any;
  updateMediapaths: any;
  updateMediascale: any;
  updateMediatimestamp: any;
  updateChartTab: any;
};

const initialState = {
  buildings: undefined,
  newTsparam: undefined,
  mediaopen: undefined,
  mediatype: undefined,
  mediapaths: undefined,
  mediascale: undefined,
  mediatimestamp: undefined,
  chartTab: undefined,
  updateBuildings: undefined,
  updateNewTsparam: undefined,
  updateMediaopen: undefined,
  updateMediatype: undefined,
  updateMediapaths: undefined,
  updateMediascale: undefined,
  updateMediatimestamp: undefined,
  updateChartTab: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
