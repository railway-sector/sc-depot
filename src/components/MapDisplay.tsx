import { use, useState } from "react";
import "../index.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-compass";
import {
  buildingLayer,
  buildingLayer_cw,
  buildingSpotLayer,
  prowLayer,
  stationLayer,
  lotStructureGroupLayer,
  droneImageVideoGroupLayer,
  droneLayers,
} from "../layers";
import "@esri/calcite-components/components/calcite-popover";
import "@esri/calcite-components/components/calcite-card";
import "@esri/calcite-components/components/calcite-button";
import "@esri/calcite-components/components/calcite-segmented-control";
import "@esri/calcite-components/components/calcite-segmented-control-item";
import "@esri/calcite-components/components/calcite-button";
import { MyContext } from "../contexts/MyContext";
import { image_scales } from "../uniqueValues";
import { addLayersToMap, updateMediaInfo } from "../query";
import DroneImageComponent from "./DroneImageComponent";
import DroneVideoComponent from "./DroneVideoComponent";

function MapDisplay() {
  const {
    mediaopen,
    mediatype,
    mediascale,
    updateMediaopen,
    updateMediatype,
    updateMediapaths,
    updateMediascale,
    updateMediatimestamp,
  } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");
  const [_mapView, setMapView] = useState<any>();

  arcgisScene?.viewOnReady(() => {
    addLayersToMap(arcgisScene?.map, [
      buildingSpotLayer,
      lotStructureGroupLayer,
      prowLayer,
      buildingLayer,
      buildingLayer_cw,
      stationLayer,
      droneImageVideoGroupLayer,
    ]);
    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;
    arcgisScene.hideAttribution = true;
    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.navigationConstraint = { type: "none" };
      arcgisScene.map.ground.opacity = 0.7;
    }
  });

  //------------------------------------//
  //     Drone Layers configuration     //
  //------------------------------------//
  const [align, setAlign] = useState<string>("Level");

  arcgisScene?.view.on("click", async (event: any) => {
    const response = await arcgisScene?.view.hitTest(event);
    const result: any = response.results[0];
    const layer_title = result?.graphic?.layer?.title;

    if (!layer_title) return;

    if (["Drone Video", "Drone Image"].includes(layer_title)) {
      const attributes = result.graphic.attributes;

      //--- Update boolean: media is opened? [controls display]
      updateMediaopen(!mediaopen);

      //--- Update media type clicked: image or video
      updateMediatype(attributes["Type"]);

      //--- Compile media info clicked
      updateMediaInfo({
        mediaLayer: droneLayers[attributes["Type"]],
        id: attributes["id"],
        srcpath: updateMediapaths,
        timestamp: updateMediatimestamp,
      });
    }
  });

  const handleScaleChange = (event: any) => {
    updateMediascale(event.target.selectedItem.id);
  };

  //--- Helper function to choose image or video Component
  const mediaComponents: Record<string, React.ReactNode> = {
    image: <DroneImageComponent />,
    video: <DroneVideoComponent />,
  };

  return (
    <arcgis-scene
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom={18}
      center="121.1609162, 14.2253630"
      onarcgisViewReadyChange={(event: any) => {
        setMapView(event.target);
      }}
    >
      {/* ---------- Media Container ---------- */}
      <div
        style={{
          display: mediaopen === true ? "block" : "none",
        }}
      >
        {/* Close Button */}
        <div style={{ display: "flex", margin: "5px" }}>
          {/* Close Button */}
          <calcite-button
            icon-end="x-circle-f"
            label="Close button"
            appearance="solid"
            onClick={() => {
              (updateMediaopen(false), updateMediapaths(null));
            }}
            scale="s"
          >
            Close
          </calcite-button>

          {/* Alignment Button */}
          <calcite-button
            icon-end={
              align === "Level"
                ? "distribute-height-evenly"
                : "distribute-width-evenly"
            }
            label="Vertically align images"
            name="vertical"
            appearance="solid"
            onClick={() => {
              setAlign((prev) => (prev === "Level" ? "vertical" : "Level"));
            }}
            scale="s"
            style={{ marginLeft: "5px" }}
          >
            {align === "Level" ? "Verical" : "Level"}
          </calcite-button>

          {/* Media Scales: */}
          <calcite-segmented-control
            oncalciteSegmentedControlChange={(event: any) => {
              handleScaleChange(event);
            }}
            scale="s"
            style={{ marginLeft: "5px" }}
          >
            {mediascale &&
              image_scales.map((scale: any, index: any) => {
                return (
                  <calcite-segmented-control-item
                    {...(mediascale === scale ? { checked: true } : {})}
                    key={index}
                    value={scale}
                    id={scale}
                  >
                    x{scale}
                  </calcite-segmented-control-item>
                );
              })}
          </calcite-segmented-control>
        </div>

        {/* Media Container: */}
        <div
          style={{
            margin: "1px",
            zIndex: 1,
            position: "fixed",
            display: align === "vertical" ? "block" : "flex",
          }}
        >
          {mediaComponents[mediatype] ?? null}
        </div>
      </div>

      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
      <arcgis-expand close-on-esc slot="top-right" mode="floating">
        <arcgis-search></arcgis-search>
      </arcgis-expand>
    </arcgis-scene>
  );
}

export default MapDisplay;
