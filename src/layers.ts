import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import {
  SimpleLineSymbol,
  MeshSymbol3D,
  FillSymbol3DLayer,
} from "@arcgis/core/symbols";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import { labelSymbol3DLine } from "./Label";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "b2a118b088a44fa0a7a84acbe0844cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

// * PROW *//
var prowRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});

export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  title: "PROW",
  popupEnabled: false,
  renderer: prowRenderer,
});
prowLayer.listMode = "hide";

// * Station Layer * //
const stationLayerTextSymbol = labelSymbol3DLine({
  materialColor: "#d4ff33",
  fontSize: 15,
  fontFamily: "Ubuntu Mono",
  fontWeight: "normal",
  haloColor: "black",
  haloSize: 0.5,
  vOffsetScreenLength: 100,
  vOffsetMaxWorldLength: 700,
  vOffsetMinWorldLength: 80,
});

var labelClass = new LabelClass({
  symbol: stationLayerTextSymbol,
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Station, "no data")',
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,
  title: "Station",
  definitionExpression: "Station <> 'Banlic Depot'",
  labelingInfo: [labelClass],
  elevationInfo: {
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

/* Building Scene Layer for station structures */
const buildingSpotLabel = labelSymbol3DLine({
  materialColor: "#d4ff33",
  fontSize: 15,
  fontFamily: "Ubuntu Mono",
  fontWeight: "normal",
  haloColor: "black",
  haloSize: 0.5,
  vOffsetScreenLength: 100,
  vOffsetMaxWorldLength: 700,
  vOffsetMinWorldLength: 80,
  calloutColor: "gray",
  calloutSize: 0.3,
});

var labelClassBulding = new LabelClass({
  symbol: buildingSpotLabel,
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Name, "no data")',
    //value: "{TEXTSTRING}"
  },
});

export const buildingSpotLayer = new FeatureLayer({
  portalItem: {
    id: "285e68f3fcce48f6ab196f912c5c58c5",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  popupEnabled: false,
  outFields: ["*"],
  labelingInfo: [labelClassBulding],
});
buildingSpotLayer.listMode = "hide";

// Building layers for Depot buildings
export const buildingLayer = new BuildingSceneLayer({
  portalItem: {
    id: "2fcb3db0ec324f92805cc45c0e79f29d",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  // Do not add outFields; otherwise, rendering get extremely slow
  title: "Depot Buildings",
});

const colorStatus = [
  [225, 225, 225, 0.1], // To be Constructed (white)
  [211, 211, 211, 0.5], // Under Construction
  [255, 0, 0, 0.8], // Delayed
  [0, 112, 255, 0.8], // Completed
];

const renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: [
    {
      value: 1,
      label: "To be Constructed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[0],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    // {
    //   value: 2,
    //   label: "Under Construction",
    //   symbol: new MeshSymbol3D({
    //     symbolLayers: [
    //       new FillSymbol3DLayer({
    //         material: {
    //           color: colorStatus[1],
    //           colorMixMode: "replace",
    //         },
    //         edges: new SolidEdges3D({
    //           color: [225, 225, 225, 0.3],
    //         }),
    //       }),
    //     ],
    //   }),
    // },
    {
      value: 4,
      label: "Completed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[3],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
  ],
});

// Discipline: Architectural
export let columnsLayer: null | any;
export let floorsLayer: null | any;
export let wallsLayer: null | any;
export let doorsLayer: null | any;
export let roofsLayer: null | any;
export let furnitureLayer: null | any;
export let stairsLayer: null | any;
export let windowsLayer: null | any;

// Discipline: Structural
export let stFramingLayer: null | any;
export let stColumnLayer: null | any;
export let stFoundationLayer: null | any;

export let genericModelLayer: null | any;
let ArchitecturalLayers: null | any;

export const popuTemplate = {
  title: "{Name}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        // {
        //   fieldName: 'target_date',
        //   label: 'Target Date',
        // },
        {
          fieldName: "Category",
          label: "Category",
        },
        {
          fieldName: "Status",
          label: "Construction Status",
        },
        {
          fieldName: "BldgLevel",
          label: "Building Level",
        },
        {
          fieldName: "StructureLevel",
          label: "Structure Level",
        },
        // {
        //   fieldName: 'P6ID',
        //   label: 'P6 ID',
        // },
      ],
    },
  ],
};

export let exteriorShellLayer: null | any;

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
        break;

      case "GenericModel":
        genericModelLayer = layer;
        genericModelLayer.popupTemplate = popuTemplate;
        genericModelLayer.title = "Generic Model";
        genericModelLayer.renderer = renderer;
        break;

      case "Furniture":
        furnitureLayer = layer;
        furnitureLayer.popupTemplate = popuTemplate;
        furnitureLayer.title = "Furniture";
        furnitureLayer.renderer = renderer;
        break;

      case "Doors":
        doorsLayer = layer;
        doorsLayer.popupTemplate = popuTemplate;
        doorsLayer.title = "Doors";
        doorsLayer.renderer = renderer;
        break;

      case "Columns":
        columnsLayer = layer;
        columnsLayer.popupTemplate = popuTemplate;
        columnsLayer.title = "Columns";
        columnsLayer.renderer = renderer;
        //excludedLayers.push(layer);
        break;

      case "Floors":
        floorsLayer = layer;
        floorsLayer.popupTemplate = popuTemplate;
        floorsLayer.title = "Floors";
        floorsLayer.renderer = renderer;
        //excludedLayers
        break;

      case "Stairs":
        stairsLayer = layer;
        stairsLayer.popupTemplate = popuTemplate;
        stairsLayer.title = "Stairs";
        stairsLayer.renderer = renderer;
        break;

      case "Roofs":
        roofsLayer = layer;
        roofsLayer.popupTemplate = popuTemplate;
        roofsLayer.title = "Roofs";
        roofsLayer.renderer = renderer;
        break;

      case "Walls":
        wallsLayer = layer;
        wallsLayer.popupTemplate = popuTemplate;
        wallsLayer.title = "Walls";
        wallsLayer.renderer = renderer;
        break;

      case "Windows":
        windowsLayer = layer;
        windowsLayer.popupTemplate = popuTemplate;
        windowsLayer.title = "Windows";
        windowsLayer.renderer = renderer;
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = popuTemplate;
        stFramingLayer.title = "Structural Framing";
        stFramingLayer.renderer = renderer;
        break;

      case "StructuralColumns":
        stColumnLayer = layer;
        stColumnLayer.popupTemplate = popuTemplate;
        stColumnLayer.title = "Structural Columns";
        stColumnLayer.renderer = renderer;
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = popuTemplate;
        stFoundationLayer.title = "Structural Foundation";
        stFoundationLayer.renderer = renderer;
        break;

      default:
        layer.visible = true;
    }
  });
});

// Building layers for Depot civil works
const renderer_cw = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: [
    {
      value: 1,
      label: "To be Constructed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[0],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    // {
    //   value: 2,
    //   label: "Under Construction",
    //   symbol: new MeshSymbol3D({
    //     symbolLayers: [
    //       new FillSymbol3DLayer({
    //         material: {
    //           color: colorStatus[1],
    //           colorMixMode: "replace",
    //         },
    //         edges: new SolidEdges3D({
    //           color: [225, 225, 225, 0.3],
    //         }),
    //       }),
    //     ],
    //   }),
    // },
    {
      value: 4,
      label: "Completed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[3],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
  ],
});

export const buildingLayer_cw = new BuildingSceneLayer({
  portalItem: {
    id: "09a326d846c84a50a332c2b8f64d2c31", //"02ae45b1cec743599866829abc1cab05",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  // Do not add outFields; otherwise, rendering get extremely slow
  title: "Depot Civil Works",
});

// Discipline: Architectural
export let architecturalLayer_cw: null | any;
export let floorsLayer_cw: null | any;
export let wallsLayer_cw: null | any;
export let stairsRailingLayer_cw: null | any;
export let plumbinFixturesLayer_cw: null | any;

// Discipline_cw: Structural
export let stFoundationLayer_cw: null | any;
export let stFramingLayer_cw: null | any;
export let stColumnsLayer_cw: null | any;
export let genericModelLayer_cw: null | any;

export const popupTemplate_cw = {
  title: "{Status}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "BaseCategory",
          label: "BaseCategory",
        },
        {
          fieldName: "Status",
          label: "Construction Status",
        },
      ],
    },
  ],
};

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
        genericModelLayer_cw.renderer = renderer;
        break;

      // case "Floors":
      //   floorsLayer_cw = layer;
      //   floorsLayer_cw.popupTemplate = popupTemplate_cw;
      //   floorsLayer_cw.renderer = renderer;
      //   floorsLayer_cw.title = "Floors";
      //   //excludedLayers
      //   break;

      // case "PlumbingFixtures":
      //   plumbinFixturesLayer_cw = layer;
      //   plumbinFixturesLayer_cw.popupTemplate = popupTemplate_cw;
      //   plumbinFixturesLayer_cw.renderer = renderer;
      //   plumbinFixturesLayer_cw.title = "PlumbingFixtures";
      //   break;

      // case "StairsRailing":
      //   stairsRailingLayer_cw = layer;
      //   stairsRailingLayer_cw.popupTemplate = popupTemplate_cw;
      //   stairsRailingLayer_cw.renderer = renderer;
      //   stairsRailingLayer_cw.title = "StairsRailing";
      //   break;

      // case "Walls":
      //   wallsLayer_cw = layer;
      //   wallsLayer_cw.popupTemplate = popupTemplate_cw;
      //   wallsLayer_cw.renderer = renderer;
      //   wallsLayer_cw.title = "Walls";
      //   break;

      case "StructuralFoundation":
        stFoundationLayer_cw = layer;
        stFoundationLayer_cw.popupTemplate = popupTemplate_cw;
        stFoundationLayer_cw.renderer = renderer_cw;
        stFoundationLayer_cw.title = "StructuralFoundation";
        break;

      case "StructuralColumns":
        stColumnsLayer_cw = layer;
        stColumnsLayer_cw.popupTemplate = popupTemplate_cw;
        stColumnsLayer_cw.renderer = renderer_cw;
        stColumnsLayer_cw.title = "StructuralColumns";
        break;

      case "StructuralFraming":
        stFramingLayer_cw = layer;
        stFramingLayer_cw.popupTemplate = popupTemplate_cw;
        stFramingLayer_cw.renderer = renderer_cw;
        stFramingLayer_cw.title = "StructuralFraming (Reference only?)";
        break;

      default:
        layer.visible = true;
    }
  });
});
