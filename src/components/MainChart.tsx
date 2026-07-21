import "@esri/calcite-components/components/calcite-tabs";
import "@esri/calcite-components/components/calcite-tab";
import "@esri/calcite-components/components/calcite-tab-nav";
import "@esri/calcite-components/components/calcite-tab-title";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { useEffect, useState } from "react";
import { buildingLayer, buildingLayer_cw } from "../layers";

// import LotChart from "./LotChart";
import "../index.css";
import BuildingChart from "./ChartBuilding";
import CivilWorkChart from "./ChartCivilWork";

function MainChart() {
  const [buildingLayerLoaded, setBuildingLayerLoaded] = useState<any>(); // 'loaded'
  const [buildingLayerCwLoaded, setBuildingLayerCwLoaded] = useState<any>();
  const [chartTabName, setChartTabName] = useState<string>("depotBuilding");

  // Somehow if you do not add arcgisScene here, the child components (ie., LotChart)
  // will not inherit arcgisScene
  // const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  useEffect(() => {
    buildingLayer.load().then(() => {
      setBuildingLayerLoaded(buildingLayer.loadStatus);
    });

    buildingLayer_cw.load().then(() => {
      setBuildingLayerCwLoaded(buildingLayer_cw.loadStatus);
    });
  }, []);

  useEffect(() => {
    const isDepot = chartTabName === "depotBuilding";
    buildingLayer.visible = isDepot;
    buildingLayer_cw.visible = !isDepot;
  }, [chartTabName]);

  return (
    <>
      <calcite-tabs
        style={{
          width: "35%",
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          // borderTopWidth: 5,
          borderColor: "#555555",
        }}
        scale="l"
        slot="panel-end"
        layout="center"
      >
        <calcite-tab-nav
          slot="title-group"
          id="thetabs"
          oncalciteTabChange={(event: any) =>
            setChartTabName(event.srcElement.selectedTitle.className)
          }
        >
          <calcite-tab-title className="depotBuilding">
            Depot Building
          </calcite-tab-title>
          <calcite-tab-title className="civilWorks">
            Civil Works
          </calcite-tab-title>
        </calcite-tab-nav>

        {/* CalciteTab: Building */}
        <calcite-tab>
          {buildingLayerLoaded === "loaded" && <BuildingChart />}
        </calcite-tab>

        {/* CalciteTab: Civil Works */}
        <calcite-tab>
          {buildingLayerCwLoaded === "loaded" &&
            chartTabName === "civilWorks" && <CivilWorkChart />}
        </calcite-tab>
      </calcite-tabs>
    </>
  );
}

export default MainChart;
