import chinaJson from "./geoJson/china.json";
import * as echarts from "echarts";
import type { FC } from "react";
import React, { useCallback, useEffect, useMemo } from "react";
import chinaSvg from "./map/china.svg";
import areaSvg from "../area.json";
import { convertData } from "./utils/china";
import { data } from "./mockData";
import { LevelObj } from "..";
import { dynamicLoadGeo } from "../AreaMap/utils";

type Props = {
  levelObj: LevelObj;
  setLevelObj: React.Dispatch<React.SetStateAction<LevelObj>>;
};

const MapEcharts: FC<Props> = ({ levelObj, setLevelObj }) => {
  const getColor = useCallback(
    (value: number, visualMapSelect: boolean[] = [true, true, true, true]) => {
      if (value >= 0 && value < 25 && visualMapSelect[3]) {
        return "#12EEA388";
      }
      if (value >= 25 && value < 50 && visualMapSelect[2]) {
        return "#F49B1688";
      }
      if (value >= 50 && value < 75 && visualMapSelect[1]) {
        return "#EE5C7F88";
      }
      if (value >= 75 && value <= 100 && visualMapSelect[0]) {
        return "#8F7DFF88";
      }
      return "#eee";
    },
    []
  );

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(1,14,13,0.77)",
        borderColor: "#41FFFF",
        borderWidth: 2,
        padding: 8,
        textStyle: {
          color: "#fff",
        },
      },
      visualMap: {
        show: true,
        left: 40,
        bottom: 40,
        type: "piecewise",
        pieces: [
          { gte: 75, label: "≥75%" },
          { gte: 50, lt: 75, label: "50%-75%" },
          { gte: 25, lt: 50, label: "25%-50%" },
          { gte: 0, lt: 25, label: "0%-25%" },
        ],
        inRange: {
          color: ["#12EEA3", "#F49B16", "#EE5C7F", "#8F7DFF"],
        },
        seriesIndex: [0, 1],
        textStyle: {
          color: "#fff",
        },
      },
      geo: {
        map: "chinaSvg",
        show: true,
        aspectScale: 1,
        zoom: 2,
        roam: true,
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },

        itemStyle: {
          normal: {
            areaColor: "#00000020",
            borderColor: "#b9eaffa0", // 线
            borderWidth: 2,
          },
          emphasis: {
            areaColor: "#42c7ff99", // 悬浮区背景
          },
        },
        regions: data?.map((item) => {
          return {
            name: item.name,
            itemStyle: {
              areaColor: getColor(item.response),
            },
          };
        }),
      },
      series: [
        {
          symbolSize: 16,
          geoIndex: 0,
          label: {
            formatter: "{b}",
            position: "right",
            show: true,
          },
          itemStyle: {
            normal: {
              color: "#fff",
            },
          },
          name: "虚拟电厂",
          type: "effectScatter",
          coordinateSystem: "geo",
          data: convertData(
            data?.map((item) => {
              return { name: item.name, value: item.response };
            }) || []
          ),
          symbol: `image://${require("../../assets/plant.png")}`,
        },
      ],
    };
  }, [getColor]);

  useEffect(() => {
    window
      .fetch(chinaSvg)
      .then((res) => {
        return res.text();
      })
      .then((e) => {
        echarts.registerMap("chinaSvg", { svg: e });
        const echartsDom = document.getElementById("echartsMap")!;
        const echartsInstance = echarts.init(echartsDom);
        echartsInstance.setOption(option as any);

        // 切换legend时修改地区颜色
        echartsInstance.on("datarangeselected", (obj: any) => {
          const currentOption: any = echartsInstance.getOption();
          currentOption.geo[0].regions = data.map((item) => {
            return {
              name: item.name,
              itemStyle: {
                areaColor: getColor(item.response, obj.selected),
              },
            };
          });

          echartsInstance.setOption(currentOption);
        });

        // 悬浮修改symbol样式
        echartsInstance?.on("mouseover", (params) => {
          if (params.seriesType === "effectScatter") {
            const { name } =
              data?.find((item) => item.name === params.name) || {};
            const echartsOption: any = echartsInstance.getOption();
            echartsOption.series[0].data = echartsOption.series[0].data.map(
              (item) => {
                if (item.symbol !== "circle") {
                  item.symbol = `image://${require("../../assets/plant.png")}`;
                  item.symbolSize = 16;
                }
                if (item.name === name) {
                  item.symbol = `image://${require("../../assets/plant_active.png")}`;
                  item.symbolSize = 26;
                }
                return item;
              }
            );
            // echartsInstance.series[0].data
            echartsInstance.setOption(echartsOption);
          }
        });

        // 点击修改值，进入其他省份
        echartsInstance?.on("click", (params) => {
          // console.log({params})
          Object.entries(areaSvg).forEach((item) => {
            if (item[1] === params.name) {
              dynamicLoadGeo({ code: item[0], name: item[1] }).then((e) => {
                if(Object.entries(e.geoCoordMap).length > 0){
                  setLevelObj({
                    provinceCode: item[0],
                    cityCode: undefined,
                    areaCode: item[0],
                    areaName: item[1],
                    convertData: e.convertData
                  });
                }
              })
            }
          });
        });
      });
  }, [getColor, option]);

  return <div id="echartsMap" style={{ width: "100%", height: "90vh" }} />;
};

export default MapEcharts;
