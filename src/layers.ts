import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import {
  b_popup,
  b_renderer,
  cw_popup,
  label_image,
  label_stationp,
  label_video,
  labelClassBulding,
  lot_label,
  lot_popup,
  lot_renderer,
  norender,
  portalItems,
  prow_renderer,
  str_popup,
  str_renderer,
} from "./uniqueValues";

//---------------------------------------------//
//              Other Layers                   //
//---------------------------------------------//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("b2a118b088a44fa0a7a84acbe0844cb2"),
});

//---------------------------------------------//
//              Media Layers                   //
//---------------------------------------------//
//--- DRONE VIDEO LAYER ---//
export const drone_video_point_layer = new FeatureLayer({
  portalItem: portalItems("ef71df6d19294328a5b756c4806c9c67"),
  layerId: 2,
  definitionExpression: "Query = 'depot'",
  title: "Drone Video",
  outFields: ["*"],
  labelingInfo: [label_video],
  popupEnabled: false,
  elevationInfo: { mode: "relative-to-scene" },
});

//--- DRONE IMAGE LAYER ---//
export const drone_image_point_layer = new FeatureLayer({
  portalItem: portalItems("ef71df6d19294328a5b756c4806c9c67"),
  layerId: 1,
  elevationInfo: { mode: "relative-to-scene" },
  definitionExpression: "Query = 'depot'",
  title: "Drone Image",
  outFields: ["*"],
  labelingInfo: [label_image],
  popupEnabled: false,
});

//--- COMPILE MEDIA LAYERS
export const droneLayers: any = {
  image: drone_image_point_layer,
  video: drone_video_point_layer,
};

export const droneImageVideoGroupLayer = new GroupLayer({
  title: "Drone Image & Video",
  visible: true,
  visibilityMode: "independent",
  layers: [drone_video_point_layer, drone_image_point_layer],
});

//---------------------------------------------//
//          Alignment Layers                   //
//---------------------------------------------//
//--- PROW LAYER ---//
export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  layerId: 5,
  title: "PROW",
  renderer: prow_renderer,
  popupEnabled: false,
});

//--- STATION POINT LAYER ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 6,
  title: "Station",
  labelingInfo: [label_stationp],
  elevationInfo: { mode: "relative-to-ground" },
});
stationLayer.listMode = "hide";

//---------------------------------------------//
//         Lot & Structure Layers              //
//---------------------------------------------//
//--- LOT LAYER ---//
export const lotLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 1,
  labelingInfo: [lot_label],
  renderer: lot_renderer,
  popupTemplate: lot_popup,
  title: "Land Acquisition",
  minScale: 30000,
  maxScale: 0,
  elevationInfo: { mode: "on-the-ground" },
});

//--- STRUCUTURE LAYER ---//
export const structureLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 2,
  title: "Structure",
  renderer: str_renderer,
  elevationInfo: { mode: "on-the-ground" },
  popupTemplate: str_popup,
});

export const lotStructureGroupLayer = new GroupLayer({
  title: "Land & Structure",
  visible: true,
  visibilityMode: "independent",
  layers: [lotLayer, structureLayer],
});

//----------------------------------------------//
//            Building Scene Layer              //
//----------------------------------------------//
//--- BUILDINGS LAYER ---//
export const buildingSpotLayer = new FeatureLayer({
  portalItem: portalItems("285e68f3fcce48f6ab196f912c5c58c5"),
  popupEnabled: false,
  outFields: ["*"],
  labelingInfo: [labelClassBulding],
});
buildingSpotLayer.listMode = "hide";

export const buildingLayer = new BuildingSceneLayer({
  portalItem: portalItems("2fcb3db0ec324f92805cc45c0e79f29d"),
  legendEnabled: false,
  title: "Building (LOD: 350)",
});

//--- ARCHITECTURAL
export let columnsLayer: null | any;
export let floorsLayer: null | any;
export let wallsLayer: null | any;
export let doorsLayer: null | any;
export let roofsLayer: null | any;
export let furnitureLayer: null | any;
export let stairsLayer: null | any;
export let windowsLayer: null | any;

//--- STRUCTURAL
export let stFramingLayer: null | any;
export let stColumnLayer: null | any;
export let stFoundationLayer: null | any;

export let genericModelLayer: null | any;
export let sublayersAll: null | any = [];

export let exteriorShellLayer: null | any;

export let testSublayers: null | any = [];
export let stf01: null | any;
export let stf02: null | any;

buildingLayer.when(() => {
  buildingLayer.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Architectural":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer = layer;
        exteriorShellLayer.title = "ExteriorShell (Buildings)";
        break;

      case "GenericModel":
        genericModelLayer = layer;
        genericModelLayer.popupTemplate = b_popup;
        genericModelLayer.title = "Generic Model (Not Monitoring)";
        genericModelLayer.visible = false;
        genericModelLayer.renderer = norender;
        break;

      case "Furniture":
        furnitureLayer = layer;
        furnitureLayer.popupTemplate = b_popup;
        furnitureLayer.title = "Furniture (Not Monitoring)";
        furnitureLayer.visible = false;
        furnitureLayer.renderer = norender;
        break;

      case "Doors":
        doorsLayer = layer;
        doorsLayer.popupTemplate = b_popup;
        doorsLayer.title = "Doors (Not Monitoring)";
        doorsLayer.visible = false;
        doorsLayer.renderer = norender;
        break;

      case "Columns":
        columnsLayer = layer;
        columnsLayer.popupTemplate = b_popup;
        columnsLayer.title = "Columns";
        columnsLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "Floors":
        floorsLayer = layer;
        floorsLayer.popupTemplate = b_popup;
        floorsLayer.title = "Floors";
        floorsLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "Stairs":
        stairsLayer = layer;
        stairsLayer.popupTemplate = b_popup;
        stairsLayer.title = "Stairs (Not Monitoring)";
        stairsLayer.visible = false;
        stairsLayer.renderer = norender;
        break;

      case "Roofs":
        roofsLayer = layer;
        roofsLayer.popupTemplate = b_popup;
        roofsLayer.title = "Roofs (Not Monitoring)";
        roofsLayer.visible = false;
        roofsLayer.renderer = norender;
        break;

      case "Walls":
        wallsLayer = layer;
        wallsLayer.popupTemplate = b_popup;
        wallsLayer.title = "Walls";
        wallsLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "Windows":
        windowsLayer = layer;
        windowsLayer.popupTemplate = b_popup;
        windowsLayer.title = "Windows (Not Monitoring)";
        windowsLayer.visible = false;
        windowsLayer.renderer = norender;
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = b_popup;
        stFramingLayer.title = "Structural Framing";
        stFramingLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralColumns":
        stColumnLayer = layer;
        stColumnLayer.popupTemplate = b_popup;
        stColumnLayer.title = "Structural Columns";
        stColumnLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = b_popup;
        stFoundationLayer.title = "Structural Foundation";
        stFoundationLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      default:
        layer.visible = true;
    }
  });
});

//--- TEST
console.log(stf01);

//--- CIVIL WORKS LAYER ---//
export const buildingLayer_cw = new BuildingSceneLayer({
  portalItem: portalItems("97d90e24ef8a43d5826a8b5190201f50"),
  legendEnabled: false,
  title: "Civil Works (LOD: 350)",
});

//-- ARCHITECTURAL
export let architecturalLayer_cw: null | any;
export let floorsLayer_cw: null | any;
export let wallsLayer_cw: null | any;
export let stairsLayer_cw: null | any;
export let stairsRailingLayer_cw: null | any;
export let roofsLayer_cw: null | any;

//-- STRUCTURAL
export let stFoundationLayer_cw: null | any;
export let stFramingLayer_cw: null | any;
export let stColumnsLayer_cw: null | any;
export let genericModelLayer_cw: null | any;

export let sublayersCivilAll: null | any = [];
export let exteriorShellLayer_cw: null | any;

buildingLayer_cw.when(() => {
  buildingLayer_cw.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Architectural":
        architecturalLayer_cw = layer;
        architecturalLayer_cw.visible = false;
        architecturalLayer_cw.title = "Architectural (reference only)";
        break;

      case "Overview":
        exteriorShellLayer_cw = layer;
        exteriorShellLayer_cw.title = "ExteriorShell";
        exteriorShellLayer_cw.visible = false;
        layer.visible = false;
        break;

      case "GenericModel":
        genericModelLayer_cw = layer;
        genericModelLayer_cw.title = "GeneralModel";
        genericModelLayer_cw.renderer = norender;
        break;

      case "Floors":
        floorsLayer_cw = layer;
        floorsLayer_cw.popupTemplate = cw_popup;
        floorsLayer_cw.renderer = norender;
        floorsLayer_cw.title = "Floors (Not Monitoring)";
        break;

      case "StairsRailing":
        stairsRailingLayer_cw = layer;
        stairsRailingLayer_cw.popupTemplate = cw_popup;
        stairsRailingLayer_cw.renderer = norender;
        stairsRailingLayer_cw.title = "StairsRailing (Not Monitoring)";
        break;

      case "Roofs":
        roofsLayer_cw = layer;
        roofsLayer_cw.popupTemplate = cw_popup;
        roofsLayer_cw.renderer = norender;
        roofsLayer_cw.title = "Roofs (Not Monitoring)";
        break;

      case "Stairs":
        stairsLayer_cw = layer;
        stairsLayer_cw.popupTemplate = cw_popup;
        stairsLayer_cw.renderer = norender;
        stairsLayer_cw.title = "Stairs (Not Monitoring)";
        break;

      case "Walls":
        wallsLayer_cw = layer;
        wallsLayer_cw.popupTemplate = cw_popup;
        wallsLayer_cw.renderer = norender;
        wallsLayer_cw.title = "Walls (Not Monitoring)";
        break;

      case "StructuralFoundation":
        stFoundationLayer_cw = layer;
        stFoundationLayer_cw.popupTemplate = cw_popup;
        stFoundationLayer_cw.renderer = b_renderer;
        stFoundationLayer_cw.title = "StructuralFoundation";
        sublayersCivilAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralColumns":
        stColumnsLayer_cw = layer;
        stColumnsLayer_cw.popupTemplate = cw_popup;
        stColumnsLayer_cw.renderer = b_renderer;
        stColumnsLayer_cw.title = "StructuralColumns";
        sublayersCivilAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFraming":
        stFramingLayer_cw = layer;
        stFramingLayer_cw.popupTemplate = cw_popup;
        stFramingLayer_cw.renderer = b_renderer;
        stFramingLayer_cw.title = "StructuralFraming (Reference only?)";
        sublayersCivilAll.push({ name: layer.modelName, layer: layer });
        break;

      default:
        layer.visible = true;
    }
  });
});
