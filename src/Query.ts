/* eslint-disable @typescript-eslint/no-unused-expressions */
import type BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import { dateTable, buildingSpotLayer } from "./layers";
import { months } from "./uniqueValues";
import type BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer";
import type SceneLayer from "@arcgis/core/layers/SceneLayer";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";

//---------------------------------//
//           Reset layer           //
//---------------------------------//
interface layersRevitVisibilityType {
  layers:
    | [
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingSceneLayer?,
        SceneLayer?,
        FeatureLayer?,
      ]
    | any;
  qExpression?: any;
}

export const resetAllLayers = ({
  layers,
  qExpression,
}: layersRevitVisibilityType) => {
  if (!layers) return;
  layers.map((layer: any) => {
    if (layer) {
      if (qExpression) {
        layer.layer.definitionExpression = qExpression;
        layer.layer.visible = true;
      } else {
        layer.layer.definitionExpression = "1=1";
        layer.layer.visible = true;
      }
    }
  });
};

//---------------------------------//
//           Media query           //
//---------------------------------//
export async function mediaQuery(layer: any, ID: any) {
  const query = layer.createQuery();
  query.where = `id = ${ID}`;

  const result = await layer.queryFeatures(query);
  const data = result.features.map((item: any) => {
    return Object.assign({
      timestamp: Number(item.attributes["TimeStamp"]),
      path: item.attributes["Path"],
    });
  });
  data.sort((a: any, b: any) => a.timestamp - b.timestamp);

  return data;
}

interface updateMediaInfoType {
  mediaLayer: any;
  id: any;
  srcpath: any;
  timestamp: any;
}
export async function updateMediaInfo({
  mediaLayer,
  id,
  srcpath,
  timestamp,
}: updateMediaInfoType) {
  const item = await mediaQuery(mediaLayer, id);

  if (item.length === 1) {
    srcpath([item[0].path, ""]);
    timestamp([item[0].timestamp, ""]);
  } else {
    srcpath([item[0].path, item[1].path]);
    timestamp([item[0].timestamp, item[1].timestamp]);
  }
}

export async function mediaTimestampToDates(timestamp: any) {
  const yyyy1 = timestamp[0].toString().slice(0, 4);
  const yyyy2 = timestamp[1].toString().slice(0, 4);
  const mm1 = months[Number(timestamp[0].toString().slice(4, 6)) - 1];
  const mm2 = months[Number(timestamp[1].toString().slice(4, 6)) - 1];

  return { yyyy1, yyyy2, mm1, mm2 };
}

// Updat date
export async function dateUpdate() {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = "project = 'SC'" + " AND " + "category = 'Depot Buildings'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

export async function buildingSpotZoom(buildingname: any, view: any) {
  const query = buildingSpotLayer.createQuery();
  const queryExpression = "Name = '" + buildingname + "'";
  const queryAll = "1=1";
  if (!buildingname) {
    query.where = queryAll;
  } else {
    query.where = queryExpression;
  }

  buildingSpotLayer.queryExtent(query).then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

// Layer list
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }
  item.title === "Depot Civil Works" ||
  item.title === "Architectural (reference only)" ||
  item.title === "Land & Structure" ||
  item.title === "ExteriorShell" ||
  item.title === "ExteriorShell (Buildings)" ||
  item.title === "Civil Works (LOD: 350)" ||
  item.title === "Generic Model (Not Monitoring)" ||
  item.title === "Furniture (Not Monitoring)" ||
  item.title === "Doors (Not Monitoring)" ||
  item.title === "Stairs (Not Monitoring)" ||
  item.title === "Roofs (Not Monitoring)" ||
  item.title === "Windows (Not Monitoring)"
    ? (item.visible = false)
    : (item.visible = true);
}
