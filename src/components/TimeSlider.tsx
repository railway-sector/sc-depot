import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import { layersTimeSliderReset, yearMonthDay } from "../query";
import { primaryLabelColor, ts_field_q } from "../uniqueValues";
import "@arcgis/map-components/components/arcgis-time-slider";
import { MyContext } from "../contexts/MyContext";
import { use, useEffect, useMemo } from "react";
import { sublayersCivilAll } from "../layers";

export default function TimeSlider() {
  const { updateNewTsparam, newTsparam } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");
  const timeSlider: any = document.querySelector("arcgis-time-slider");

  //--- TimeExtent
  const timeExtent = {
    start: new Date(2024, 1, 1),
    end: new Date(2031, 6, 15),
  };

  //-------------------------------------------//
  //   Reset when date parameter is changed    //
  //-------------------------------------------//
  useEffect(() => {
    if (!timeSlider) return;
    timeSlider.timeExtent = { start: timeExtent.start, end: timeExtent.start };
  }, [newTsparam]);

  //-------------------------------------------//
  //          New selected date field          //
  //-------------------------------------------//
  // Recompute only when a new date parameter is selected (else use the cached)
  const newDateField = useMemo(
    () => ts_field_q?.find((f: any) => f.datename === newTsparam)?.datefield,
    [newTsparam],
  );

  useEffect(() => {
    arcgisScene?.viewOnReady(() => {
      const timeSlider: any = document.querySelector("arcgis-time-slider");

      timeSlider.fullTimeExtent = {
        start: timeExtent.start,
        end: timeExtent.end,
      };

      timeSlider.stops = {
        interval: {
          value: 1,
          unit: "months",
        },
      };

      reactiveUtils.watch(
        () => timeSlider?.timeExtent,
        (timeExtent) => {
          if (timeExtent) {
            const { year, month, day } = yearMonthDay(timeExtent.end);
            const new_date = `${year}-${month}-${day}`;

            layersTimeSliderReset({
              layers: sublayersCivilAll.map((l: any) => l.layer),
              field_name: newDateField,
              new_date: new_date,
            });
          }
        },
      );
    });
  }, [newTsparam, newDateField]);

  return (
    <>
      <div>
        <calcite-select
          label=""
          style={{ "--calcite-select-text-color": primaryLabelColor }}
          oncalciteSelectChange={(event: any) =>
            updateNewTsparam(event.srcElement.value)
          }
        >
          {ts_field_q.map((p: any, index: any) => {
            return (
              <calcite-option
                key={index}
                value={p.datename}
                selected={p.datename === newTsparam}
              >
                {p.datename}
              </calcite-option>
            );
          })}
        </calcite-select>

        <arcgis-time-slider
          referenceElement="arcgis-scene"
          slot="bottom-right"
          layout="auto"
          mode="cumulative-from-start"
        ></arcgis-time-slider>
      </div>
    </>
  );
}
