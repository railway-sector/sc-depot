import { useEffect, useRef, useState } from "react";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import {
  buildingLayer_cw,
  chartstack_c,
  queryc2,
  sublayersCivilAll,
} from "../layers";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { thousands_separators, resetAllLayers } from "../query";
import {
  chart_colors,
  civilworkTypes,
  status_field,
  statusArray,
} from "../uniqueValues";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import { queryDefinitionExpression } from "../queryExpression";
import { useQuery } from "@tanstack/react-query";
import { legendSetter, rootSetter } from "../chartSetter";
import ChartStackColumnRender, { resetQuerc } from "chart-stack-column-render";

// Draw chart
const ChartCivilWork = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const chartID = "depot-civil-works";

  const sublayersArray = sublayersCivilAll.map((item: any) => item.layer);

  const { data } = useQuery<any>({
    queryKey: [],
    queryFn: async () => {
      //--- Reset
      resetQuerc(queryc2);

      queryDefinitionExpression({
        queryExpression: undefined,
        featureLayer: sublayersArray,
      });

      chartstack_c.layers = sublayersArray;
      chartstack_c.statusState = [1, 2, 3, 4]; // 2, 3 are dummy
      const chartData = await chartstack_c.chartDataStackColumns();

      return {
        chartData: chartData[0] || [],
        totaln: chartData[1] || 0,
        perc: chartData[2] || 0,
      };
    },
    staleTime: Infinity,
  });
  const chartData = data?.chartData || [];
  const totaln = data?.totaln || 0;
  const perc_comp = data?.perc || 0;

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;
  // const chartSeriesFillColorOngoing = "#d3d3d3"; // orfiginal: #FF0000
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;
  const chartPaddingRightIconLabel = 10;

  //-------------------------------------//
  //    Responsive Chart parameters      //
  //-------------------------------------//
  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.035;

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      }),
    );
    chartRef.current = chart;

    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      centerY: 50,
      x: 60,
      y: 97,
      marginTop: 20,
      scale: 0.9,
      layout: root.horizontalLayout,
    });
    legendRef.current = legend;

    const crender = new ChartStackColumnRender(
      true,
      sublayersCivilAll,
      root,
      chart,
      chartData,
      buildingLayer_cw,
      queryc2,
      civilworkTypes,
      undefined,
      ["Completed", "To be Constructed", "Under Construction"],
      ["comp", "incomp", "ongoing"],
      statusArray,
      status_field,
      chart_colors,
      chartBorderLineColor,
      chartBorderLineWidth,
      arcgisScene?.view,
      setSublayerViewFilter,
      new_chartIconSize,
      new_axisFontSize,
      undefined,
      chartPaddingRightIconLabel,
      legend,
      setChartPanelwidth,
    );
    crender.chartRendererColumn();
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  //-- Reset clicked event in chart series
  useEffect(() => {
    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });
    }

    resetAllLayers({
      layers: sublayersCivilAll,
      qExpression: undefined,
    });
  }, [resetButtonClicked]);

  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Station_Structures_icon.svg"
          alt="Station Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "20px", paddingLeft: "10px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              marginRight: "20px",
            }}
          >
            TOTAL PROGRESS
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {perc_comp} %
          </dd>
          <div
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}*0.5px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
            }}
          >
            ({thousands_separators(totaln)})
          </div>
        </dl>
      </div>

      <div
        id={chartID}
        style={{
          // width: "24vw",
          height: "64vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginRight: "10px",
        }}
      ></div>
      <div
        id="filterButton"
        style={{
          width: "50%",
          marginLeft: "30%",
          marginTop: "4%",
          // paddingTop: "10%",
        }}
      >
        <calcite-button
          iconEnd="reset"
          scale="s"
          onClick={() =>
            setResetButtonClicked(resetButtonClicked === false ? true : false)
          }
        >
          Reset Chart Filter
        </calcite-button>
      </div>
    </>
  );
};

export default ChartCivilWork;
