import DropdownData from "./DropdownContext";
import { dateUpdate } from "../query";
import { useQuery } from "@tanstack/react-query";

function Header() {
  const { data } = useQuery<any>({
    queryKey: ["As_Of_Date"],
    queryFn: () => dateUpdate("Depot Buildings"),
    staleTime: Infinity,
  });
  const asofdate = data ?? "";

  return (
    <>
      <header
        slot="header"
        id="header-title"
        style={{
          display: "flex",
          height: "70px",
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          borderTopWidth: 5,
          borderColor: "#555555",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/DOTr_Logo_v2.png"
          alt="DOTr Logo"
          height={"55px"}
          width={"55px"}
          style={{
            marginBottom: "auto",
            marginTop: "auto",
          }}
        />
        <b
          style={{
            color: "white",
            marginLeft: "1rem",
            fontSize: "2.6vh",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          SC Depot
        </b>
        <div
          style={{
            color: "#d1d5db",
            marginTop: "auto",
            marginLeft: "auto",
          }}
        >
          {!asofdate ? "" : "As of " + asofdate}
        </div>

        {/* Dropdown component */}
        <div
          style={{
            marginBottom: "auto",
            marginTop: "auto",
            marginLeft: "auto",
            marginRight: "10px",
            display: "flex",
          }}
        >
          <div style={{ margin: "auto", marginRight: "150px" }}>
            <DropdownData />
          </div>

          <img
            src="https://EijiGorilla.github.io/Symbols/Projec_Logo/GCR LOGO.png"
            alt="GCR Logo"
            height={"50px"}
            width={"75px"}
          />
        </div>
      </header>
    </>
  );
}

export default Header;
