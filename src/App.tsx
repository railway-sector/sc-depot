import { useState, useEffect } from "react";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import MainChart from "./components/MainChart";
import UndergroundSwitch from "./components/UndergroundSwitch";
import { MyContext } from "./contexts/MyContext";
import { image_scales } from "./uniqueValues";
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "jlhWZpfkc0N5L0P0");
  }, []);

  const [buildings, setBuildings] = useState<any>();
  const [imageopen, setImageOpen] = useState<boolean>(false);
  const [mediatype, setMediatype] = useState<string>();
  const [mediasrcpaths, setMediasrcpaths] = useState<string>();
  const [mediaSelectedscale, setMediaSelectedscale] = useState<any>(
    image_scales[0],
  );
  const [mediatimestamp, setMediatimestamp] = useState<any>();

  const updateBuildings = (newBuilding: any) => {
    setBuildings(newBuilding);
  };

  const updateImageOpen = (newImageOpen: any) => {
    setImageOpen(newImageOpen);
  };

  const updateMediatype = (newMedia: any) => {
    setMediatype(newMedia);
  };

  const updateMediasrcpaths = (newSrc: any) => {
    setMediasrcpaths(newSrc);
  };

  const updateMediaSelectedscale = (newScale: any) => {
    setMediaSelectedscale(newScale);
  };

  const updateMediatimestamp = (NewTime: any) => {
    setMediatimestamp(NewTime);
  };

  return (
    <>
      {loggedInState === true ? (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext
              value={{
                buildings,
                imageopen,
                mediatype,
                mediasrcpaths,
                mediaSelectedscale,
                mediatimestamp,
                updateBuildings,
                updateImageOpen,
                updateMediatype,
                updateMediasrcpaths,
                updateMediaSelectedscale,
                updateMediatimestamp,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <UndergroundSwitch />
                <MapDisplay />
                <MainChart />
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default App;
