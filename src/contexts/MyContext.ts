import { createContext } from "react";

type MyDropdownContextType = {
  buildings: any;
  imageopen: any;
  mediatype: any;
  mediasrcpaths: any;
  mediaSelectedscale: any;
  mediatimestamp: any;
  updateBuildings: any;
  updateImageOpen: any;
  updateMediatype: any;
  updateMediasrcpaths: any;
  updateMediaSelectedscale: any;
  updateMediatimestamp: any;
};

const initialState = {
  buildings: undefined,
  updateBuildings: undefined,
  imageopen: undefined,
  mediatype: undefined,
  mediasrcpaths: undefined,
  mediaSelectedscale: undefined,
  mediatimestamp: undefined,
  updateImageOpen: undefined,
  updateMediatype: undefined,
  updateMediasrcpaths: undefined,
  updateMediaSelectedscale: undefined,
  updateMediatimestamp: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
