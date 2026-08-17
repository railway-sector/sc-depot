import { useState, useEffect, useCallback } from "react";
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
import { image_scales, ts_field_q } from "./uniqueValues";
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "jlhWZpfkc0N5L0P0");
  }, []);

  const [buildings, setBuildings] = useState<any>();
  const [newTsparam, setNewTsparam] = useState<any>(ts_field_q[0].datename);
  const [mediaopen, setMediaopen] = useState<boolean>(false);
  const [mediatype, setMediatype] = useState<string>();
  const [mediapaths, setMediapaths] = useState<string>();
  const [mediascale, setMediascale] = useState<any>(image_scales[0]);
  const [mediatimestamp, setMediatimestamp] = useState<any>();
  const [chartTab, setChartTab] = useState<any>("depotBuilding");

  const updateBuildings = useCallback((newBuilding: any) => {
    setBuildings(newBuilding);
  }, []);

  const updateNewTsparam = useCallback((newParam: any) => {
    setNewTsparam(newParam);
  }, []);

  const updateMediaopen = useCallback((newImageOpen: any) => {
    setMediaopen(newImageOpen);
  }, []);

  const updateMediatype = useCallback((newMedia: any) => {
    setMediatype(newMedia);
  }, []);

  const updateMediapaths = useCallback((newSrc: any) => {
    setMediapaths(newSrc);
  }, []);

  const updateMediascale = useCallback((newScale: any) => {
    setMediascale(newScale);
  }, []);

  const updateMediatimestamp = useCallback((NewTime: any) => {
    setMediatimestamp(NewTime);
  }, []);

  const updateChartTab = useCallback((NewTab: any) => {
    setChartTab(NewTab);
  }, []);

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
                newTsparam,
                mediaopen,
                mediatype,
                mediapaths,
                mediascale,
                mediatimestamp,
                chartTab,
                updateBuildings,
                updateNewTsparam,
                updateMediaopen,
                updateMediatype,
                updateMediapaths,
                updateMediascale,
                updateMediatimestamp,
                updateChartTab,
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
