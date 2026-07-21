import { useState, use } from "react";
import Select from "react-select";
import "../index.css";
import { MyContext } from "../contexts/MyContext";
import { buildingSpotLayer } from "../layers";
import GenerateDropdownData from "dropdown-pkg-arcgis";
import { useQuery } from "@tanstack/react-query";

const theme = {
  bg: "#2b2b2b",
  bgDisabled: "#232323",
  border: "#444444",
  borderHover: "#5a5a5a",
  borderFocus: "#6aa9ff",
  text: "#ffffff",
  textMuted: "#9a9a9a",
  optionFocused: "#3a3a3a",
  optionSelected: "#353535",
};

const customStyles = {
  container: (s: any) => ({ ...s, width: "180px" }),
  control: (s: any, { isDisabled, isFocused }: any) => ({
    ...s,
    backgroundColor: isDisabled ? theme.bgDisabled : theme.bg,
    borderColor: isFocused ? theme.borderFocus : theme.border,
    borderRadius: "6px",
    minHeight: "36px",
    boxShadow: "none",
    opacity: isDisabled ? 0.6 : 1,
    "&:hover": {
      borderColor: isFocused ? theme.borderFocus : theme.borderHover,
    },
  }),
  placeholder: (s: any) => ({ ...s, color: theme.textMuted }),
  singleValue: (s: any) => ({ ...s, color: theme.text }),
  input: (s: any) => ({ ...s, color: theme.text }),
  indicatorSeparator: (s: any) => ({ ...s, backgroundColor: theme.border }),
  dropdownIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  clearIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  menu: (s: any) => ({
    ...s,
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    overflow: "hidden",
  }),
  option: (s: any, { isFocused, isSelected }: any) => ({
    ...s,
    backgroundColor: isFocused
      ? theme.optionFocused
      : isSelected
        ? theme.optionSelected
        : theme.bg,
    color: theme.text,
    cursor: "pointer",
  }),
};

export default function DropdownData() {
  const { updateBuildings } = use(MyContext);
  const [buildingName, setBuildingName] = useState<null | any>(null);

  const { data: municipalList } = useQuery<any>({
    queryKey: ["dropdownData"], // Do not add lotLayer as a dependency. The dropdown list will not be updated properly.
    queryFn: async () => {
      return await new GenerateDropdownData(
        [buildingSpotLayer],
        ["Name"],
      ).dropDownQuery();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // handle change event of the Municipality dropdown
  const handleBuildingChange = (obj: any) => {
    setBuildingName(obj);
    updateBuildings(obj ? obj.field1 : null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        gap: "12px",
        marginRight: "250px",
      }}
    >
      <Select
        placeholder="Select Building"
        value={buildingName}
        options={municipalList && municipalList}
        onChange={handleBuildingChange}
        getOptionLabel={(x: any) => x.field1}
        isClearable
        styles={customStyles}
      />
    </div>
  );
}
