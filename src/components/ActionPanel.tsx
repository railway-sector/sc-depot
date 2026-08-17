import "@esri/calcite-components/components/calcite-panel";
import "@esri/calcite-components/components/calcite-list-item";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-action-bar";
import "@arcgis/map-components/components/arcgis-building-explorer";
import { use, useEffect, useState } from "react";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-direct-line-measurement-3d";
import { buildingLayer, sublayersAll, sublayersCivilAll } from "../layers";
import { building_f, defineActions } from "../uniqueValues";
import TimeSlider from "./TimeSlider";
import { MyContext } from "../contexts/MyContext";

function ActionPanel() {
  const { chartTab, buildings } = use(MyContext);
  const shellPanel: any = document.getElementById("left-shell-panel");
  const timeSlider = document.querySelector("arcgis-time-slider");

  //-----------------------------------------
  //   Define active & next widget states
  //-----------------------------------------
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);

  //--- Render only when selected
  const [hasOpenedBasemaps, setHasOpenedBasemaps] = useState<boolean>(false);

  useEffect(() => {
    if (nextWidget === "basemaps") setHasOpenedBasemaps(true);
  }, [nextWidget]);

  //--- Widget (Line measurement & Building Explorer)
  const directLineMeasure = document.querySelector(
    "arcgis-direct-line-measurement-3d",
  );

  const arcgisBuildingExplorer = document.querySelector(
    "arcgis-building-explorer",
  );

  //-----------------------------------------------------//
  //              Initially Load building layer          //
  //-----------------------------------------------------//
  const [buildingLayerLoaded, setLotLayerLoaded] = useState<any>(null);

  //--- Wait until building layer is loaded
  useEffect(() => {
    buildingLayer.load().then(() => {
      setLotLayerLoaded(buildingLayer.loadStatus);
    });
  }, []);

  //--- Building Explorer accepts building layer when ready
  useEffect(() => {
    if (buildingLayerLoaded !== "loaded" || !arcgisBuildingExplorer) return;
    arcgisBuildingExplorer.layers = [buildingLayer];
  }, [buildingLayerLoaded, buildingLayer]);

  //--- Click action handler function for active & next widget
  const handleActionClick = (event: any) => {
    const id = event.target.id;
    setNextWidget(id);
    setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
  };

  useEffect(() => {
    if (activeWidget) {
      const actionActiveWidget: any = document.querySelector(
        `[data-panel-id=${activeWidget}]`,
      );
      actionActiveWidget.hidden = true;
      shellPanel.collapsed = true;

      directLineMeasure && directLineMeasure.clear();

      //--- Timesilder: Reset
      if (timeSlider) {
        timeSlider.timeExtent = null;
        if (chartTab === "depotBuilding") {
          sublayersAll.map((sublayer: any) => {
            sublayer.layer.definitionExpression = `${building_f} = '${buildings}'`;
          });
        }

        if (chartTab === "civilWorks") {
          sublayersCivilAll.map((sublayer: any) => {
            sublayer.layer.definitionExpression = "1=1";
          });
        }
      }
    }

    if (nextWidget !== activeWidget) {
      const actionNextWidget: any = document.querySelector(
        `[data-panel-id=${nextWidget}]`,
      );
      actionNextWidget.hidden = false;
      shellPanel.collapsed = false;

      //--- Timesilder Panel: Collapse
      if (nextWidget === "timeslider") shellPanel.collapsed = true;
    }
  });

  return (
    <>
      <calcite-shell-panel
        slot="panel-start"
        id="left-shell-panel"
        displayMode="dock"
        collapsed
      >
        <calcite-action-bar
          slot="action-bar"
          style={{
            borderStyle: "solid",
            borderRightWidth: 3.5,
            borderLeftWidth: 3.5,
            borderBottomWidth: 4.5,
            borderColor: "#555555",
          }}
        >
          <calcite-action
            data-action-id="layers"
            icon="layers"
            text="layers"
            id="layers"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="basemaps"
            icon="basemap"
            text="basemaps"
            id="basemaps"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="buildingexplorer"
            icon="organization"
            text="Building Explorer"
            id="buildingexplorer"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="directline-measure"
            icon="measure-line"
            text="Line Measurement"
            id="directline-measure"
            onClick={handleActionClick}
          ></calcite-action>

          {chartTab === "civilWorks" && (
            <calcite-action
              data-action-id="timeslider"
              icon="sliders-horizontal"
              text="Time Slider"
              id="timeslider"
              onClick={handleActionClick}
            ></calcite-action>
          )}

          <calcite-action
            data-action-id="information"
            icon="information"
            text="Information"
            id="information"
            onClick={handleActionClick}
          ></calcite-action>
        </calcite-action-bar>

        <calcite-panel heading="Layers" data-panel-id="layers" hidden>
          <arcgis-layer-list
            referenceElement="arcgis-scene"
            selectionMode="multiple"
            visibilityAppearance="checkbox"
            filter-placeholder="Filter layers"
            listItemCreatedFunction={defineActions}
          ></arcgis-layer-list>
        </calcite-panel>

        <calcite-panel heading="Basemaps" data-panel-id="basemaps" hidden>
          {hasOpenedBasemaps ? (
            <arcgis-basemap-gallery referenceElement="arcgis-scene"></arcgis-basemap-gallery>
          ) : null}{" "}
        </calcite-panel>

        <calcite-panel
          heading="Building Explorer"
          data-panel-id="buildingexplorer"
          hidden
        >
          <arcgis-building-explorer referenceElement="arcgis-scene"></arcgis-building-explorer>
        </calcite-panel>

        <calcite-panel
          heading="Direct Line Measure"
          data-panel-id="directline-measure"
          hidden
        >
          <arcgis-direct-line-measurement-3d
            id="directLineMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
          ></arcgis-direct-line-measurement-3d>
        </calcite-panel>

        <calcite-panel
          className="timeslider"
          data-panel-id="timeslider"
          hidden
        ></calcite-panel>

        <calcite-panel heading="Description" data-panel-id="information" hidden>
          {nextWidget === "information" ? (
            <div style={{ paddingLeft: "20px" }}>
              This smart map shows the construction progress on structural
              components of depot buildings:
              <ul>
                <li>Structural Foundation, </li>
                <li>Structural Column, </li>
                <li>Structural Framing, </li>
                <li>Roofs, </li>
                <li>Floors, </li>
                <li>Walls, </li>
                <li>Others </li>
              </ul>
              <div style={{ paddingLeft: "20px" }}>
                <li>
                  The source of data: <b>BIM models.</b>
                </li>
                <li>
                  {" "}
                  The Contractors update construction progress directly in the
                  BIM models. The GIS Team uses the BIM models for updating
                  smart maps.
                </li>
              </div>
            </div>
          ) : (
            <div className="informationDiv" hidden></div>
          )}
        </calcite-panel>
      </calcite-shell-panel>

      {nextWidget === "timeslider" && nextWidget !== activeWidget && (
        <TimeSlider />
      )}
    </>
  );
}

export default ActionPanel;
