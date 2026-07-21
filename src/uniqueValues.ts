import LabelClass from "@arcgis/core/layers/support/LabelClass";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D.js";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer.js";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { yearMonthDay } from "./query";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer";
import { labelSymbol3DLine } from "./label";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = {
  url: "https://gis.railway-sector.com/portal",
};

export const portalItems = (id: any) => {
  return {
    id: id,
    portal: portalItem_url,
  };
};

//----------------------------------------------//
//           Chart Parameters                   //
//----------------------------------------------//
export const primaryLabelColor = "#d1d5db";
export const valueLabelColor = "#d1d5db";

//---------------------------------------------//
//         Media Layer Parameter               //
//---------------------------------------------//
export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- PROW LAYER ---//
export const prow_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});

//--- STATION POINT LAYER ---//
export const label_stationp = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: "#d4ff33" },
        size: 13,
        halo: { color: "black", size: 0.5 },
        font: { family: "Ubuntu Mono" },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 150,
      minWorldLength: 120,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "white",
      size: 0.7,
      border: { color: "grey" },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Station, "no data")',
  },
});

//----------------------------------------------//
//                Media Layers                  //
//----------------------------------------------//
//--- DRONE IMAGE & VIDEO LAYERS ---//
interface LabelSymbolMedia {
  srcL: number;
  maxWL: number;
  minWL: number;
}

function labelSymbol3DMedia({ srcL, maxWL, minWL }: LabelSymbolMedia) {
  const symbol = new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: [255, 255, 0] },
        size: 15,
        halo: { color: "black", size: 0.5 },
      }),
    ],
    verticalOffset: {
      screenLength: srcL,
      maxWorldLength: maxWL,
      minWorldLength: minWL,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: { color: "grey" },
    },
  });
  return symbol;
}

//--- DRONE IMAGE LAYER ---//
export const label_image = new LabelClass({
  symbol: labelSymbol3DMedia({ srcL: 40, maxWL: 30, minWL: 20 }),
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: "$feature.Type" },
});

//--- DRONE VIDEO LAYER ---//
export const label_video = new LabelClass({
  symbol: labelSymbol3DMedia({ srcL: 20, maxWL: 10, minWL: 10 }),
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: "$feature.Type" },
});

//---------------------------------------------//
//         Lot & Structure Layers              //
//---------------------------------------------//
export const lot_hod_f = "HandOverDate";
export const lot_hdod_f = "HandedOverDate";
export const lot_id_f = "LotID";
export const lot_pri_f = "Priority1_1";
export const lot_status_f = "StatusLA";
export const municipality_f = "Municipality";
export const barangay_f = "Barangay";
export const lot_lo_f = "LandOwner";
export const cp_f = "CP";
export const lot_lu_f = "LandUse";
export const lot_endorsed_f = "Endorsed";
export const lot_ho_f = "HandedOver";
export const lot_hoa_f = "HandedOverArea";
export const lot_pho_f = "percentHandedOver";
export const lot_aa_f = "AffectedArea";
export const lot_tunnel_f = "TunnelAffected";
export const lot_endorsed_arr = ["Not Endorsed", "Endorsed", "NA"];

//--- LOT LAYER ---//
export const lot_status_q = [
  { value: 1, category: "Paid", color: "#00734d" },
  { value: 2, category: "For Payment Processing", color: "#0070ff" },
  { value: 3, category: "For Legal Pass", color: "#ffff00" },
  { value: 4, category: "For Offer to Buy", color: "#ffaa00" },
  { value: 5, category: "For Notice of Taking", color: "#FF5733" },
  { value: 6, category: "With PTE", color: "#70AD47" },
  { value: 7, category: "For Expropriation", color: "#6f0000" },
  { value: 8, category: "Optimized", color: "#B2B2B2" },
];

//--- Layer Labels
export const lot_label = new LabelClass({
  labelExpressionInfo: { expression: "$feature.LotID" },
  symbol: {
    type: "text",
    color: "black",
    haloColor: "white",
    haloSize: 0.5,
    font: { size: 11, weight: "bold" },
  },
});

export const lot_symbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: { color: [110, 110, 110], width: 0.7 },
});

export const lot_uniqueV = lot_status_q.map((item: any) => {
  return Object.assign({
    value: item.value,
    label: item.category,
    symbol: new SimpleFillSymbol({ color: item.color }),
  });
});

export const lot_renderer = new UniqueValueRenderer({
  field: lot_status_f,
  defaultSymbol: lot_symbol, // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: lot_uniqueV,
});

//--- Layer Popup
const highlight = (value: unknown) =>
  `<span style="color: #d9dc00ff; font-weight: bold">${value}</span>`;

const customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    const attrs = event.graphic.attributes;
    const hod = attrs[lot_hod_f];
    const hdod = attrs[lot_hdod_f];
    const hoa = attrs[lot_pho_f];
    const statusV = attrs[lot_status_f];
    const lu = attrs[lot_lu_f];
    const municipal = attrs[municipality_f];
    const barangay = attrs[barangay_f];
    const lo = attrs[lot_lo_f];
    const cp = attrs[cp_f];
    const endorse = attrs[lot_endorsed_f];
    const endorsed = lot_endorsed_arr[endorse];
    const remarks = attrs["Remarks"];
    const note = attrs["note"];

    //--- Hand-Over Date
    let hod1: any;
    if (hod) {
      const { year, month, day } = yearMonthDay(new Date(hod));
      hod1 = `${year}-${month}-${day}`;
    }

    //--- Handed-Over Date
    let hdod1: any;
    if (hdod) {
      const { year, month, day } = yearMonthDay(new Date(hod));
      hdod1 = `${year}-${month}-${day}`;
    }

    //--- Status with label
    const statusLabel =
      lot_status_q.find((f: any) => f.value === statusV)?.category ?? "";
    const lu_label = lu >= 1 ? lot_lu_arr[lu - 1] : "";

    return `
    <div style='color: #eaeaea'>
    <ul><li>Handed-Over Area: ${highlight(`${hoa ?? ""} %`)}</li>
    <li>Hand-Over Date: ${highlight(hdod1 ?? "")}</li>
    <li>Handed-Over Date: ${highlight(hod1 ?? "")}</li>
    <li>Status:           ${highlight(statusLabel ?? "")}</li>
    <li>Land Use:         ${highlight(lu_label ?? "")}</li>
    <li>Municipality:     ${highlight(municipal ?? "")}</li>
    <li>Barangay:         ${highlight(barangay ?? "")}</li>
    <li>Land Owner:       ${highlight(lo ?? "")}</li>
    <li>CP:               ${highlight(cp ?? "")}</li>
    <li>Endorsed:         ${highlight(endorsed ?? "")}</li>
    <li>Acquisition Status: ${highlight(remarks ?? "")}</li>
    <li>Note: ${highlight(note ?? "")}</li></ul>
    </div>
              `;
  },
});

export const lot_popup = new PopupTemplate({
  title: "<div style='color: #eaeaea'>Lot No.: <b>{LotID}</b></div>",
  lastEditInfoEnabled: false,
  content: [customContentLot],
});

//--- Land use Array
export const lot_lu_arr = [
  "Agricultural",
  "Agricultural & Commercial",
  "Agricultural / Residential",
  "Commercial",
  "Industrial",
  "Irrigation",
  "Residential",
  "Road",
  "Road Lot",
  "Special Exempt",
];

//--- STRUCTURE LAYER ---//
export const str_status_f = "StatusStruc";
export const str_id_f = "StrucID";
export const str_pte_f = "PTE";

export const rgb = [
  [0, 197, 255, 0.6],
  [112, 173, 71, 0.6],
  [0, 112, 255, 0.6],
  [255, 255, 0, 0.6],
  [255, 170, 0, 0.6],
  [255, 83, 73, 0.6],
  [178, 190, 181, 0.6],
  [111, 0, 0, 0.6],
];

export const str_status_q = [
  {
    value: 1,
    category: "Demolished",
    color: "#00C5FF",
    colrgb: rgb[0],
  },
  { value: 2, category: "Paid", color: "#70AD47", colrgb: rgb[1] },
  {
    value: 3,
    category: "For Payment Processing",
    color: "#0070FF",
    colrgb: rgb[2],
  },
  { value: 4, category: "For Legal Pass", color: "#FFFF00", colrgb: rgb[3] },
  {
    value: 5,
    category: "For Offer to Compensate",
    color: "#FFAA00",
    colrgb: rgb[4],
  },
  {
    value: 6,
    category: "For Notice of Taking",
    color: "#FF5733",
    colrgb: rgb[5],
  },
  {
    value: 7,
    category: "No Need to Acquire",
    color: "#B2BEB5",
    colrgb: rgb[6],
  },
  {
    value: 8,
    category: "For Expropriation",
    color: "#6f0000",
    colrgb: rgb[7],
  },
];

const height = 5;
const edgeSize = 0.3;

const str_symbol = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 5,
      material: { color: [0, 0, 0, 0.4] },
      edges: new SolidEdges3D({ color: "#4E4E4E", size: edgeSize }),
    }),
  ],
});

const str_uniqueV = str_status_q.map((item: any) => {
  return {
    value: item.value,
    symbol: new PolygonSymbol3D({
      symbolLayers: [
        new ExtrudeSymbol3DLayer({
          size: height,
          material: { color: item.colrgb },
          edges: new SolidEdges3D({ color: "#4E4E4E", size: edgeSize }),
        }),
      ],
    }),
    label: item.category,
  };
});

export const str_renderer = new UniqueValueRenderer({
  defaultSymbol: str_symbol,
  defaultLabel: "Other",
  field: str_status_f,
  uniqueValueInfos: str_uniqueV,
});

export const str_popup = {
  title: "<div style='color: #eaeaea'>{StrucID}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "StrucOwner", label: "Structure Owner" },
        { fieldName: "Municipality" },
        { fieldName: "Barangay" },
        { fieldName: "StatusStruc", label: "<p>Status for Structure</p>" },
        { fieldName: "Name" },
        { fieldName: "Status", label: "Households Ownership (structure) " },
      ],
    },
  ],
};

//----------------------------------------------//
//            Building Scene Layer              //
//----------------------------------------------//
//--- COMMON PARAMETERS ---//
// For sublayers with no monitoring requirements
export const norender = new SimpleRenderer({
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: [255, 255, 155, 0.3], colorMixMode: "replace" },
        edges: new SolidEdges3D({ color: [255, 255, 155, 0.3] }),
      }),
    ],
  }),
});

export const status_q: any = [
  {
    value: 1,
    status: "incomp",
    label: "To be Constructed",
    color: "#000000",
    rgb: [225, 225, 225, 0.1],
  },
  {
    value: 2,
    status: "ongoing",
    label: "Under Construction",
    color: "#f7f7f7ff",
    rgb: [211, 211, 211, 0.5],
  },
  {
    value: 3,
    status: "delayed",
    label: "Delayed",
    color: "#FF0000",
    rgb: [255, 0, 0, 0.8],
  },
  {
    value: 4,
    status: "comp",
    label: "Completed",
    color: "#0070ff",
    rgb: [0, 112, 255, 0.8],
  },
];

//--- BUILDINGS LAYER
export const type_f = "Type";
export const status_f = "Status";
export const category_f = "Category";
export const building_f = "Name";

export const building_types_q = [
  { value: 1, category: "St.Foundation", modelName: "StructuralFoundation" },
  { value: 2, category: "St.Column", modelName: "StructuralColumns" },
  { value: 3, category: "St.Framing", modelName: "StructuralFraming" },
  { value: 4, category: "Floors", modelName: "Floors" },
  { value: 5, category: "Walls", modelName: "Walls" },
  { value: 6, category: "Columns", modelName: "Columns" },
];

export const b_popup = {
  title: "{Name}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "Name", label: "Building" },
        // { fieldName: "Type", label: "Type" },
        { fieldName: "Category", label: "Category" },
        { fieldName: "Status", label: "Construction Status" },
        { fieldName: "BldgLevel", label: "Building Level" },
        { fieldName: "StructureLevel", label: "Structure Level" },
      ],
    },
  ],
};

//--- SYMBOLOGY
const b_uniqueV = status_q.map((f: any) => {
  return {
    value: f.value,
    symbol: new MeshSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          material: { color: f.rgb, colorMixMode: "replace" },
          edges: new SolidEdges3D({ color: [225, 225, 225, 0.3] }),
        }),
      ],
    }),
  };
});

export const b_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: b_uniqueV,
});

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

export const labelClassBulding = new LabelClass({
  symbol: buildingSpotLabel,
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: 'DefaultValue($feature.Name, "no data")' },
});

//--- CIVIL WORKS LAYER
export const civil_types_q = [
  { value: 1, category: "St.Foundation", modelName: "StructuralFoundation" },
  { value: 2, category: "St.Column", modelName: "StructuralColumns" },
  { value: 3, category: "St.Framing", modelName: "StructuralFraming" },
];

export const cw_popup = {
  title: "{Status}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "BaseCategory", label: "BaseCategory" },
        { fieldName: "Status", label: "Construction Status" },
      ],
    },
  ],
};

//---------------------------------//
//           Layer List            //
//---------------------------------//
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
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
