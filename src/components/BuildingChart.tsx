/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState, use } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { buildingSpotZoom, thousands_separators } from "../Query";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import {
  columnsLayer,
  floorsLayer,
  queryc,
  stColumnLayer,
  stFoundationLayer,
  stFramingLayer,
  sublayersAll,
  wallsLayer,
} from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import {
  building_field,
  buildingTypes,
  chart_colors,
  status_field,
} from "../uniqueValues";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import { chartDataStackColumns } from "../ChartDataGenerator";
import { queryDefinitionExpression } from "../QueryExpression";
import { chartRenderer, resetAllLayers } from "../ChartRenderer";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// Draw chart
const BuildingChart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { buildings, updateChartPanelwidth, chartPanelwidth } = use(MyContext);
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [chartData, setChartData] = useState<any>([]);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const highlightedSublayerView = useRef<any>(undefined);
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);

  const chartID = "station-bar";
  useEffect(() => {
    queryc.qValues = [buildings];
    queryc.qFields = [building_field];
    queryDefinitionExpression({
      queryExpression: queryc.queryExpression(),
      featureLayer: [
        stFoundationLayer,
        stColumnLayer,
        stFramingLayer,
        floorsLayer,
        wallsLayer,
        columnsLayer,
      ],
    });

    chartDataStackColumns({
      qChart: queryc.queryExpression(),
      chartCategoryTypes: buildingTypes,
      chartCategoryField: undefined,
      chartCategoryValueType: "string", //
      layers: [
        stFoundationLayer,
        stColumnLayer,
        stFramingLayer,
        floorsLayer,
        wallsLayer,
        columnsLayer,
      ],
      statusState: [1, 2, 3, 4],
      statusField: status_field,
    }).then((response: any) => {
      setChartData(response[0]);
      setTotalNumber(response[1]);
      setProgress(response[2]);
    });

    buildingSpotZoom(buildings, arcgisScene);
  }, [buildings]);

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
  const chartPaddingRightIconLabelSpace = 10;

  //-------------------------------------//
  //    Responsive Chart parameters      //
  //-------------------------------------//
  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.035;

  useEffect(() => {
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

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

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.percent(60),
        y: am5.percent(97),
        marginTop: 20,
        scale: 0.9,
        layout: root.horizontalLayout,
      }),
    );
    legendRef.current = legend;

    chartRenderer({
      root: root,
      chart: chart,
      data: chartData,
      chartCategoryTypes: buildingTypes,
      chartCategoryField: undefined,
      q1Value: buildings,
      q1Field: building_field,
      statusTypename: ["Completed", "To be Constructed", "Under Construction"], //["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp", "ongoing"], //["comp", "incomp", "ongoing"],
      statusField: status_field,
      seriesStatusColor: chart_colors,
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      arcgisScene: arcgisScene,
      setSublayerViewFilter: setSublayerViewFilter,
      sublayersCollection: sublayersAll,
      highlightedSublayerView: highlightedSublayerView,
      chartPaddingRightIconLabelSpace: chartPaddingRightIconLabelSpace,
      new_chartIconSize: new_chartIconSize,
      new_axisFontSize: new_axisFontSize,
      legend: legend,
      updateChartPanelwidth: updateChartPanelwidth,
    });

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

      highlightedSublayerView.current &&
        highlightedSublayerView.current.remove();
    }

    resetAllLayers({
      layers: sublayersAll,
      qExpression: !buildings
        ? undefined
        : `${building_field} = '${buildings}'`,
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
            {progress} %
          </dd>
          <div
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}*0.5px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
            }}
          >
            ({thousands_separators(totalNumber)})
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

export default BuildingChart;
