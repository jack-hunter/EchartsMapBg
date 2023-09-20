import { Button } from "antd";
import * as echarts from "echarts";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { LevelObj } from "..";
import areaSvg from "../area.json";
import { data } from "./mockData";
import "./index.less";
import { changConvertData, dynamicLoadGeo } from "./utils";

type Props = {
  levelObj: LevelObj;
  setLevelObj: React.Dispatch<React.SetStateAction<LevelObj>>;
};

const Map: FC<Props> = ({ levelObj, setLevelObj }) => {
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
          { lt: 25, label: "<25%" },
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
        map: levelObj.areaName,
        show: true,
        aspectScale: 0.9,
        zoom: 1.2,
        // roam: true,
        label: {
          normal: {
            show: false,
            color: "#fff",
          },
          emphasis: {
            show: false,
          },
        },

        itemStyle: {
          normal: {
            areaColor: "#eeeeee40",
            borderColor: "#97F6FF", // 线
            borderWidth: 2,
          },
          // emphasis: {
          //   areaColor: '#97F6FF80', // 悬浮区背景
          // },
        },
      },
      series: [
        {
          type: "map",
          map: levelObj.areaName,
          // geoIndex: 0,
          aspectScale: 0.9,
          zoom: 1.2,
          showLegendSymbol: false, // 存在legend时显示
          data: levelObj?.convertData?.(
            data?.map((item) => {
              let total = 0;
              data?.forEach((i) => {
                total = i.response > total ? i.response : total;
              });
              return { name: item.name, value: (item.response / total) * 100 };
            }) || []
          ),
          // data?.map((item) => {
          //   let total = 0;
          //   data?.forEach((i) => {
          //     total = i.response > total ? i.response : total;
          //   });
          //   let _name = item.name;
          //   if (provinceId === '1') {
          //     _name =
          //       item.name.substring(item.name.length - 1, item.name?.length) === '省' ||
          //       item.name.substring(item.name.length - 1, item.name?.length) === '市' ||
          //       item.name.substring(item.name.length - 1, item.name?.length) === '区'
          //         ? item.name
          //         : `${item.name}市`;
          //   }
          //   return {
          //     name: _name,
          //     value: !item.response ? undefined : (item.response / total) * 100,
          //   };
          // }) || [],
          color: ["#ff0", "#f0f"],
          tooltip: {
            show: false,
          },
          label: {
            // show: false,
            color: "#fff",
            formatter(value) {
              return `${value?.name}`;
            },
            position: "inside",
            fontWeight: "bolder",
            height: 18,
            // width: 55,
            borderWidth: 2,
            borderType: "solid",
            borderColor: "rgba(28, 28, 55, 0.8)",
            backgroundColor: "rgba(28, 28, 55, 0.8)",
          },
          select: {
            disabled: true,
          },
          itemStyle: {
            areaColor: "#1b4d5180",
            borderColor: "#C9F0FF",
            borderWidth: 2,
            color: "none",
            opacity: 0.5,
          },
          emphasis: {
            itemStyle: {
              areaColor: "#97F6FF80",
              borderColor: "#97F6FF",
              // opacity: 0.26,
            },
            label: {
              // show: false,
              color: "#fff",
              fontWeight: "bold",
            },
          },
        },
        {
          symbolSize: 25,
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
          type: "scatter",
          coordinateSystem: "geo",
          // data: [],
          data: levelObj?.convertData?.(
            data?.map((item) => {
              let total = 0;
              data?.forEach((i) => {
                total = i.response > total ? i.response : total;
              });
              return { name: item.name, value: (item.response / total) * 100 };
            }) || []
          ),
          // tooltip: {
          //   formatter: (e) => {
          //     const {
          //       name,
          //       loadCount,
          //       load,
          //       powerCount,
          //       power,
          //       storageCount,
          //       storage,
          //       demand,
          //       response,
          //     } = data?.find((item) => item.name === e.name) || {};

          //     return `<div class='tooltip-box'>
          //       <div class='province'>
          //         ${name}
          //       </div>
          //       <div class="block">
          //         <span class="title">可控负荷：</span>
          //         <span class="value">${loadCount}个/${load}MW</span>
          //       </div>
          //       <div class="block">
          //         <span class="title">分布式发电：</span>
          //         <span class="value">${powerCount}个/${power}MW</span>
          //       </div>
          //       <div class="block">
          //         <span class="title">分布式储能：</span>
          //         <span class="value">${storageCount}个/${storage}MW</span>
          //       </div>
          //       <div class="block">
          //         <span class="title">地区需求量：</span>
          //         <span class="value">${demand}MW</span>
          //       </div>
          //       <div class="block">
          //         <span class="title">最大容量：</span>
          //         <span class="value">${response}MW</span>
          //       </div>
          //     </div>`;
          //   },
          // },
          // eslint-disable-next-line global-require
          symbol: `image://${require("../../assets/plant.png")}`,
        },
      ],
    };
  }, [data]);

  useEffect(() => {
    let timer;
    const echartsDom = document.getElementById("echarts")!;
    const echartsInstance = echarts.init(echartsDom);
    echartsInstance.setOption(option as any);
    clearInterval(timer);
    // 点击修改值，进入其他省份
    echartsInstance?.on("click", (params) => {
      Object.entries(areaSvg).forEach((item) => {
        if (item[1] === params.name) {
          dynamicLoadGeo({ code: item[0], name: item[1] }).then((e) => {
            if (Object.entries(e.geoCoordMap).length > 0) {
              setLevelObj({
                provinceCode: levelObj.provinceCode,
                cityCode: item[0],
                areaCode: item[0],
                areaName: item[1],
              });
            }
          });
        }
      });
    });

    // ----------------------------------start动态效果--------------------------------------------------

    if (data) {
      let dataIndex = 0;
      const getTip = (index) => {
        return echartsInstance.dispatchAction({
          type: "showTip",
          seriesIndex: 1, // 针对series下第几个数据
          dataIndex: index, // 第几个数据
          position: (point) => {
            return [point[0] + 10, point[1] + 20];
          },
        });
      };

      echartsInstance?.on("mouseover", () => {
        clearInterval(timer);
      });

      echartsInstance?.on("mouseout", () => {
        timer = setInterval(() => {
          if (dataIndex === data.length - 1) {
            dataIndex = 0;
          } else {
            dataIndex += 1;
          }
          getTip(dataIndex);
        }, 5000);
      });

      timer = setInterval(() => {
        if (dataIndex === data.length - 1) {
          dataIndex = 0;
        } else {
          dataIndex += 1;
        }
        getTip(dataIndex);
      }, 5000);

      getTip(dataIndex);
    }

    // ----------------------------------end动态效果--------------------------------------------------
    return () => {
      clearInterval(timer);
    };
  }, [data, option, levelObj]);

  return (
    <div className={`Map`} style={{ width: "100%" }}>
      {levelObj.provinceCode && (
        <Button
          ghost
          type="primary"
          className="back-btn"
          onClick={() => {
            Object.entries(areaSvg).forEach((item) => {
              if (item[0] === levelObj.provinceCode) {
                if (levelObj.cityCode) {
                  return setLevelObj({
                    provinceCode: levelObj.provinceCode,
                    cityCode: undefined,
                    areaCode: item[0],
                    areaName: item[1],
                  });
                } else {
                  return setLevelObj({
                    provinceCode: undefined,
                    cityCode: undefined,
                    areaCode: "1",
                    areaName: "中国",
                  });
                }
              }
            });
          }}
        >
          返回
        </Button>
      )}
      <div id="echarts" style={{ width: "100%", height: "90vh" }} />
    </div>
  );
};

export default Map;
