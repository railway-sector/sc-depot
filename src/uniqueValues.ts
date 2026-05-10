export const type_field = "Type";
export const status_field = "Status";
export const category_field = "Category";
export const building_field = "Name";
export const statusStateValues = [1, 2, 3, 4];

//--- type definitions
export type StatusTypenamesType =
  | "To be Constructed"
  | "Under Construction"
  | "delayed"
  | "Completed";
export type StatusStateType = "comp" | "incomp" | "ongoing" | "delayed";
export type LayerNameType = "utility" | "viaduct" | "others";
export type TypeFieldType = "number" | "string";

// Media parameters
export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

// month
export const months = [
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

export const buildingName_field = "Name";

//--- building types
export const building_type_labels = [
  "St.Foundation",
  "St.Column",
  "St.Framing",
  "Floors",
  "Walls",
  "Columns",
];

//-- model names
export const sublayerModelNames = [
  "StructuralFoundation",
  "StructuralColumns",
  "StructuralFraming",
  "Floors",
  "Walls",
  "Columns",
];

export const building_type_values = [1, 2, 3, 5, 6, 7];
export const buildingTypes = building_type_labels.map(
  (label: any, index: any) => {
    return Object.assign({
      category: label,
      value: building_type_values[index],
      modelName: sublayerModelNames[index],
    });
  },
);

//--- Civil Works types
export const civilwork_type_labels = [
  "St.Foundation",
  "St.Column",
  "St.Framing",
];

//-- model names
export const civilSublayerModelNames = [
  "StructuralFoundation",
  "StructuralColumns",
  "StructuralFraming",
];

export const civilwork_type_values = [1, 2, 3];
export const civilworkTypes = civilwork_type_labels.map(
  (label: any, index: any) => {
    return Object.assign({
      category: label,
      value: civilwork_type_values[index],
      modelName: civilSublayerModelNames[index],
    });
  },
);

//--- chart parameters
export const chart_colors = ["#000000", "#f7f7f7ff", "#FF0000", "#0070ff"];
