/* eslint-disable @typescript-eslint/no-unused-expressions */
import { buildingLayer, dateTable, buildingSpotLayer } from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { type StatusStateType } from "./uniqueValues";
import type { StatusTypenamesType, TypeFieldType } from "./uniqueValues";

import BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer.js";
import type BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";

//--------------------------------//
//    queryExpression             //
//--------------------------------//
interface queryExpressionType {
  q1Value?: any;
  q1Field?: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  chartCategory?: any;
  chartCategoryField?: any;
  status?: number;
  statusField?: any;
  qExpression?: any;
}
export function queryExpression({
  q1Value,
  q1Field,
  q2Value,
  q2Field,
  q3Value,
  q3Field,
  chartCategory,
  chartCategoryField,
  status,
  statusField,
  qExpression,
}: queryExpressionType) {
  //--- Basic query expression
  const query1 =
    typeof q1Value === "number"
      ? `${q1Field} = ${q1Value}`
      : `${q1Field} = '${q1Value}'`;
  const query2 =
    typeof q2Value === "number"
      ? `${q2Field} = ${q2Value}`
      : `${q2Field} = '${q2Value}'`;
  const query3 =
    typeof q3Value === "number"
      ? `${q3Field} = ${q3Value}`
      : `${q3Field} = '${q3Value}'`;
  const query12 = `${query1} AND ${query2}`;
  const query123 = `${query1} AND ${query2} AND ${query3}`;
  const q_status = `${statusField} = ${status}`;
  const q_chartC = `${chartCategoryField} = '${chartCategory}'`;
  const q_status_chartC = `${q_status} AND ${q_chartC}`;
  const query1_chartC = `${query1} AND ${q_chartC}`;
  const query12_chartC = `${query12} AND ${q_chartC}`;
  const query123_chartC = `${query123} AND ${q_chartC}`;
  const query1_status = `${query1} AND ${q_status}`;
  const query12_status = `${query12} AND ${q_status}`;
  const query123_status = `${query123} AND ${q_status}`;
  const query1_status_chartC = `${query1_status} AND ${q_chartC}`;
  const query12_status_chartC = `${query12_status} AND ${q_chartC}`;
  const query123_status_chartC = `${query123_status} AND ${q_chartC}`;

  //--- With qExpression
  const query1_qE = `${query1} AND ${qExpression}`;
  const query12_qE = `${query12} AND ${qExpression}`;
  const query123_qE = `${query123} AND ${qExpression}`;
  const q_status_qE = `${q_status} AND ${qExpression}`;
  const q_chartC_qE = `${q_chartC} AND ${qExpression}`;
  const q_status_chartC_qE = `${q_status_chartC} AND ${qExpression}`;
  const query1_chartC_qE = `${query1_chartC} AND ${qExpression}`;
  const query12_chartC_qE = `${query12_chartC} AND ${qExpression}`;
  const query123_chartC_qE = `${query123_chartC} AND ${qExpression}`;
  const query1_status_qE = `${query1_status} AND ${qExpression}`;
  const query12_status_qE = `${query12_status} AND ${qExpression}`;
  const query123_status_qE = `${query123_status} AND ${qExpression}`;
  const query1_status_chartC_qE = `${query1_status_chartC} AND ${qExpression}`;
  const query12_status_chartC_qE = `${query12_status_chartC} AND ${qExpression}`;
  const query123_status_chartC_qE = `${query123_status_chartC} AND ${qExpression}`;

  let expression = "";
  if (qExpression) {
    if (chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_chartC_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_chartC_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_chartC_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_chartC_qE;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_chartC_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_chartC_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_chartC_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_chartC_qE;
        }
      }
    } else if (!chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_qE;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = qExpression;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_qE;
        }
      }
    }
  } else if (!qExpression) {
    if (chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_chartC;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_chartC;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_chartC;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_chartC;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_chartC;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_chartC;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_chartC;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_chartC;
        }
      }
    } else if (!chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = "1=1";
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123;
        }
      }
    }
  }
  return expression;
}

//---------------------------------------------------------//
//    Definition Expression using queryExpression          //
//---------------------------------------------------------//
interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
}: queryDefinitionExpressionType) {
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
            layer.visible = true;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
        featureLayer.visible = true;
      }
    }
  }
}

//--------------------------------//
//    Chart Data Generation       //
//--------------------------------//
interface queryBuildingLayersType {
  q1Value: any;
  q1Field: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  chartCategoryTypes?: any;
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryValueType?: TypeFieldType;
  layers:
    | [
        BuildingComponentSublayer,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
      ]
    | any;
  status?: number;
  statusState?: any;
  statusField?: any;
  qExpression?: any;
}

export async function chartDataQuery({
  q1Value: q1Value,
  q1Field: q1Field,
  layers: layers,
  statusState: statusState,
  statusField: statusField,
  qExpression: qExpression,
}: queryBuildingLayersType) {
  //--- types: include 'others'. Each main type may have others (types = 0)
  const compile: any = [];

  //--- Main statistics
  statusState.map((status: any) => {
    const temp = new StatisticDefinition({
      onStatisticField: `CASE WHEN ${statusField} = ${status} THEN 1 ELSE 0 END`,
      outStatisticFieldName: `stats${status}`,
      statisticType: "sum",
    });
    compile.push(temp);
  });

  //--- Query
  const query = new Query();
  query.outStatistics = compile;

  const expression = queryExpression({
    q1Value: q1Value,
    q1Field: q1Field,
    qExpression: qExpression,
  });
  query.where = expression;

  //--- Query features using statistics definitions
  const qStats = layers?.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats[compile[0].outStatisticFieldName];
    const ongoing = stats[compile[1].outStatisticFieldName];
    const delayed = stats[compile[2].outStatisticFieldName];
    const comp = stats[compile[3].outStatisticFieldName];
    const total = incomp + ongoing + delayed + comp;

    return [incomp, comp, ongoing, delayed, total];
  });
  return qStats;
}

export async function chartDataStackColumns({
  q1Value: q1Value,
  q1Field: q1Field,
  layers: layers,
  chartCategoryTypes: chartCategoryTypes,
  chartCategoryField: chartCategoryField,
  chartCategoryValueType: chartCategoryValueType,
  statusState: statusState,
  statusField: statusField,
  qExpression: qExpression,
}: queryBuildingLayersType) {
  if (chartCategoryField) {
    // 1. Map through types and return a promise for each type
    const promises = chartCategoryTypes.map(async (type: any) => {
      let total_comp = 0;
      let total_incomp = 0;
      let total_ongoing = 0;
      let total_delayed = 0;

      // 2. Use Promise.all to wait for all statuses
      await Promise.all(
        statusState.map(async (status: any) => {
          const onStatisticField =
            chartCategoryValueType === "number"
              ? `CASE WHEN (${chartCategoryField} = ${type.value} AND ${statusField} = ${status}) THEN 1 ELSE 0 END`
              : `CASE WHEN (${chartCategoryField} = '${type.value}' AND ${statusField} = ${status}) THEN 1 ELSE 0 END`;

          const temp = new StatisticDefinition({
            onStatisticField: onStatisticField,
            outStatisticFieldName: "temp",
            statisticType: "sum",
          });

          const query = new Query();
          query.outStatistics = [temp];
          query.where = queryExpression({
            q1Value: q1Value,
            q1Field: q1Field,
            qExpression: qExpression,
          });

          // 3. Await layer queries
          for (const layer of layers) {
            const response = await layer.queryFeatures(query);
            const stats = response.features[0]?.attributes;
            if (stats) {
              if (status === 1) total_incomp += stats["temp"] || 0;
              if (status === 2) total_ongoing += stats["temp"] || 0;
              if (status === 3) total_delayed += stats["temp"] || 0;
              if (status === 4) total_comp += stats["temp"] || 0;
            }
          }
        }),
      );

      // Return the compiled result for this type
      return {
        category: type.category,
        comp: total_comp,
        incomp: total_incomp,
        ongoing: total_ongoing,
        delayed: total_delayed,
      };
    });

    // 4. Wait for all type calculations to finish
    const results = await Promise.all(promises);
    const total_comp = results.reduce(
      (sum: any, item: any) => sum + item.comp,
      0,
    );
    const total_all = results.reduce(
      (sum: any, item: any) =>
        sum + item.comp + item.incomp + item.ongoing + item.delayed,
      0,
    );
    const progress =
      total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

    return [results, total_all, progress];
    //--------------------------//
    //    only status field     //
    //--------------------------//
  } else {
    let total_comp = 0;
    let total_all = 0;

    const data0 = chartCategoryTypes.map(async (type: any, index: any) => {
      //--- Calculate statistics
      const stats = await chartDataQuery({
        q1Value: q1Value,
        q1Field: q1Field,
        layers: layers[index],
        statusState: statusState,
        statusField: statusField,
        qExpression: qExpression,
      });

      //--- Compute total numbers for completed and grand total
      total_comp += stats[1];
      total_all += stats[4];

      return Object.assign({
        category: type.category,
        comp: stats[1],
        incomp: stats[0],
        ongoing: stats[2],
        delayed: stats[3],
      });
    });

    //--- Resolve Promise all
    const data = await Promise.all(data0);
    const progress =
      total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

    return [data, total_all, progress];
  }
}

//--------------------------------//
//    Chart Renderer parameters   //
//--------------------------------//
//-- Responsve parameters
export function responsiveChart(chart: any, legend: any) {
  chart.onPrivate("width", (width: any) => {
    const availableSpace = width * 0.35; // original 0.7
    const new_fontSize = width / 35;

    legend.labels.template.setAll({
      fill: am5.color("#ffffff"),
      fontSize: new_fontSize,
    });

    legend.itemContainers.template.setAll({
      width: availableSpace,
      marginLeft: 10,
      marginRight: 10,
    });
  });
}

//--- LayerView Filter and Highlight
interface layerViewQueryType {
  layer?: any;
  chartCategoryTypes?: any;
  categorySelected?: any;
  building?: any;
  qExpression?: any;
  sublayerNames?: any;
  sublayersCollection?: any;
  types?: any;
  view: any;
  setSublayerViewFilter?: any;
  highlightedSublayerView?: any;
}

//--- Filter sublayers when clicking column chart series
export const sublayersQuery = (
  chartCategoryTypes: any,
  categorySelected: any,
  expression: any,
  sublayersCollection: any,
) => {
  sublayersCollection.map((sublayer: any) => {
    if (
      sublayer.name ===
      chartCategoryTypes.find((item: any) => item.category === categorySelected)
        .modelName
    ) {
      sublayer.layer.definitionExpression = expression;
      sublayer.layer.visible = true;
    } else {
      sublayer.layer.visible = false;
    }
  });
};

interface layersRevitVisibilityType {
  layers: [
    BuildingComponentSublayer,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingSceneLayer?,
  ];
}

export const layersRevitAllVisible = ({
  layers,
}: layersRevitVisibilityType) => {
  if (layers) {
    layers.map((layer: any) => {
      if (layer) {
        layer.definitionExpression = "1=1";
        layer.visible = true;
      }
    });
  }
};

export const highlightFilterBuildingSublayerView = ({
  layer,
  chartCategoryTypes,
  categorySelected,
  qExpression,
  sublayerNames,
  view,
  setSublayerViewFilter,
  sublayersCollection,
  highlightedSublayerView,
}: layerViewQueryType) => {
  view?.whenLayerView(layer).then((layerView: any) => {
    //--- Create sublayerview
    const sublayerView = layerView.sublayerViews.find((sublayerView: any) => {
      return sublayerView.sublayer.modelName === sublayerNames; // sublayerNames;
    });

    const query = sublayerView.createQuery();
    sublayerView.queryObjectIds(query).then((result: any) => {
      highlightedSublayerView.current = sublayerView.highlight(result);
    });

    setSublayerViewFilter(sublayerView);
    sublayersQuery(
      chartCategoryTypes,
      categorySelected,
      qExpression,
      sublayersCollection,
    );

    //--- Reset filter and highlight when sequentially clicking column series
    //--- Without this, reset button will not completely work.
    if (sublayerView) {
      highlightedSublayerView.current &&
        highlightedSublayerView.current.remove();
      sublayerView.filter = new FeatureFilter({
        where: undefined,
      });
    } else {
      sublayerView.filter = new FeatureFilter({
        where: qExpression,
      });
      highlightedSublayerView.current &&
        highlightedSublayerView.current.remove();
    }
  });
};

//--- Click event on series
export function clickSeries(
  series: any,
  q1Value: any,
  q1Field: any,
  chartCategoryTypes: any,
  chartCategoryField: any,
  statusStatename: any,
  statusField: any,
  arcgisScene: any,
  setSublayerViewFilter: any,
  sublayersCollection: any,
  highlightedSublayerView: any,
) {
  series.columns.template.events.on("click", (ev: any) => {
    const selected: any = ev.target.dataItem?.dataContext;
    const categorySelected: string = selected.category;
    const find = chartCategoryTypes.find(
      (emp: any) => emp.category === categorySelected,
    );
    const typeSelected = find?.value;
    const selectedStatus: number | null =
      statusStatename === "comp"
        ? 4
        : statusStatename === "ongoing"
          ? 2
          : statusStatename === "delayed"
            ? 3
            : 1;

    const expression_revit = queryExpression({
      q1Value: q1Value,
      q1Field: q1Field,
      chartCategory: typeSelected,
      chartCategoryField: chartCategoryField,
      status: selectedStatus,
      statusField: statusField,
      qExpression: undefined,
    });

    //--- Find sublayer
    const selectedSublayerName = chartCategoryTypes.find(
      (emp: any) => emp.category === categorySelected,
    )?.modelName;

    //--- Hilight and Filter
    // Building sublayers
    highlightFilterBuildingSublayerView({
      layer: buildingLayer,
      chartCategoryTypes: chartCategoryTypes,
      categorySelected: categorySelected,
      qExpression: expression_revit,
      sublayerNames: selectedSublayerName,
      sublayersCollection: sublayersCollection,
      view: arcgisScene?.view,
      setSublayerViewFilter: setSublayerViewFilter,
      highlightedSublayerView: highlightedSublayerView,
    });
  });
}

//--- Chart series
export function makeSeries(
  root: any,
  chart: any,
  q1Value: any,
  q1Field: any,
  data: any,
  chartCategoryTypes: any, // buildingTypes
  chartCategoryField: any,
  statusTypename: any,
  statusStatename: any,
  statusField: any,
  xAxis: any,
  yAxis: any,
  legend: any,
  new_axisFontSize: any,
  seriesStatusColor: any,
  strokeColor: any,
  strokeWidth: any,
  arcgisScene: any,
  setSublayerViewFilter: any,
  sublayersCollection: any,
  highlightedSublayerView: any,
) {
  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: statusTypename,
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      baseAxis: yAxis,
      valueXField: statusStatename,
      valueXShow: "valueXTotalPercent",
      categoryYField: "category",
      fill:
        statusStatename === "incomp"
          ? am5.color(seriesStatusColor[0])
          : statusStatename === "comp"
            ? am5.color(seriesStatusColor[3])
            : statusStatename === "delayed"
              ? am5.color(seriesStatusColor[2])
              : am5.color(seriesStatusColor[1]),
      stroke: am5.color(strokeColor),
    }),
  );

  series.columns.template.setAll({
    fillOpacity: statusStatename === "comp" ? 1 : 0.5,
    tooltipText: "{name}: {valueX}", // "{categoryY}: {valueX}",
    tooltipY: am5.percent(90),
    strokeWidth: strokeWidth,
  });
  series.data.setAll(data);

  series.appear();

  series.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Label.new(root, {
        text:
          statusStatename === "incomp"
            ? ""
            : "{valueXTotalPercent.formatNumber('#.')}%", //"{valueX}",
        fill: root.interfaceColors.get("alternativeText"),
        opacity: statusStatename === "incomp" ? 0 : 1,
        fontSize: new_axisFontSize,
        centerY: am5.p50,
        centerX: am5.p50,
        populateText: true,
      }),
    });
  });

  // Click series
  clickSeries(
    series,
    q1Value,
    q1Field,
    chartCategoryTypes,
    chartCategoryField,
    statusStatename,
    statusField,
    arcgisScene,
    setSublayerViewFilter,
    sublayersCollection,
    highlightedSublayerView,
  );

  legend.data.push(series);
}

//--- Chart Renderer
interface chartType {
  root: any;
  chart: any;
  data: any;
  q1Value?: any;
  q1Field?: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  chartCategoryTypes: any;
  chartCategoryField?: any;
  // 'statusTypename' and 'statusStatename': E.g., you can add or delete status you wish to add in stacked columns.
  statusTypename: StatusTypenamesType[]; // order has no effect on statistics
  statusStatename: StatusStateType[]; // order affects the order displayed in stacked column charts
  statusField?: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  arcgisScene: any;
  setClickedCategory?: any;
  setSublayerViewFilter?: any;
  sublayersCollection?: any;
  highlightedSublayerView?: any;
  new_chartIconSize: any;
  new_axisFontSize: any;
  chartIconPositionX?: any;
  chartPaddingRightIconLabelSpace?: any;
  legend: any;
  updateChartPanelwidth: any;
}
export function chartRenderer({
  root,
  chart,
  data,
  chartCategoryTypes,
  chartCategoryField,
  q1Value,
  q1Field,
  statusTypename,
  statusStatename,
  statusField,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  arcgisScene,
  setSublayerViewFilter,
  sublayersCollection,
  highlightedSublayerView,
  new_chartIconSize,
  new_axisFontSize,
  chartIconPositionX,
  chartPaddingRightIconLabelSpace,
  legend,
  updateChartPanelwidth,
}: chartType) {
  // Axis Renderer
  const yRenderer = am5xy.AxisRendererY.new(root, {
    inversed: true,
  });

  //--- yAxix
  const yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: yRenderer,
      bullet: function (root: any, _axis: any, dataItem: any) {
        return am5xy.AxisBullet.new(root, {
          location: 0.5,
          sprite: am5.Picture.new(root, {
            width: new_chartIconSize,
            height: new_chartIconSize,
            centerY: am5.p50,
            centerX: am5.p50,
            x: chartIconPositionX ? chartIconPositionX : null,
            src: dataItem.dataContext.icon,
          }),
        });
      },
      tooltip: am5.Tooltip.new(root, {}),
    }),
  );

  yRenderer.labels.template.setAll({
    paddingRight: chartPaddingRightIconLabelSpace
      ? chartPaddingRightIconLabelSpace
      : null,
  });

  yRenderer.grid.template.setAll({
    location: 1,
  });

  yAxis.get("renderer").labels.template.setAll({
    oversizedBehavior: "wrap",
    textAlign: "center",
    fill: am5.color("#ffffff"),
    //maxWidth: 150,
    fontSize: new_axisFontSize,
  });
  yAxis.data.setAll(data);

  //--- xAxix
  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      calculateTotals: true,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0,
        strokeWidth: 1,
        stroke: am5.color("#ffffff"),
      }),
    }),
  );

  xAxis.get("renderer").labels.template.setAll({
    //oversizedBehavior: "wrap",
    textAlign: "center",
    fill: am5.color("#ffffff"),
    //maxWidth: 150,
    fontSize: new_axisFontSize,
  });

  //--- Responsive Chart
  responsiveChart(chart, legend);
  chart.onPrivate("width", (width: any) => {
    updateChartPanelwidth(width);
  });

  //--- Make Series
  statusTypename &&
    statusTypename.map((statustype: any, index: any) => {
      makeSeries(
        root,
        chart,
        q1Value,
        q1Field,
        data,
        chartCategoryTypes, // buildingTypes
        chartCategoryField,
        statustype,
        statusStatename[index],
        statusField,
        xAxis,
        yAxis,
        legend,
        new_axisFontSize,
        seriesStatusColor,
        strokeColor,
        strokeWidth,
        arcgisScene,
        setSublayerViewFilter,
        sublayersCollection,
        highlightedSublayerView,
      );
    });
}

//---------------------------------//
//           Media query           //
//---------------------------------//
export async function mediaQuery(layer: any, ID: any) {
  const query = layer.createQuery();
  query.where = `id = ${ID}`;
  const final = layer.queryFeatures(query).then((result: any) => {
    const stats = result.features;
    const data = stats.map((item: any) => {
      return Object.assign({
        timestamp: Number(item.attributes["TimeStamp"]),
        path: item.attributes["Path"],
      });
    });
    data.sort((a: any, b: any) => a.timestamp - b.timestamp);
    return data;
  });
  return final;
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
