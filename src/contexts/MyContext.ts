import { createContext } from "react";

type MyDropdownContextType = {
  buildings: any;
  mediaopen: any;
  mediatype: any;
  mediapaths: any;
  mediascale: any;
  mediatimestamp: any;
  updateBuildings: any;
  updateMediaopen: any;
  updateMediatype: any;
  updateMediapaths: any;
  updateMediascale: any;
  updateMediatimestamp: any;
};

const initialState = {
  buildings: undefined,
  updateBuildings: undefined,
  mediaopen: undefined,
  mediatype: undefined,
  mediapaths: undefined,
  mediascale: undefined,
  mediatimestamp: undefined,
  updateMediaopen: undefined,
  updateMediatype: undefined,
  updateMediapaths: undefined,
  updateMediascale: undefined,
  updateMediatimestamp: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
