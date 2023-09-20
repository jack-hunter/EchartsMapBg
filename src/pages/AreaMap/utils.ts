import * as echarts from "echarts";

export const convertDataCallback = (geoCoordMap) => {
  return (data) => {
    const res: any[] = [];
    for (let i = 0; i < data.length; i++) {
      const geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
        });
      }
    }
    return res;
  };
};

/** 动态加载地图及处理地图数据 */
export const dynamicLoadGeo = async ({ name, code }) => {
  let geoCoordMap = {
    // 广东省: [117.19, 23.13],
  };
  let convertData = (data) => {
    return data;
  };

  // 使用动态导入语法异步加载文件
  try {
    const codeId = code?.length > 6 ? code.slice(0, 6) : code;
    // webpack需要配置动态引入，如umi则需要开启dynamicImport
    const module = await import(`./geoJson/${codeId}.json`);
    const data = module.default;
    
    // 文件加载成功后执行的逻辑
    echarts.registerMap(name, data as any);
    console.log('echarts:',{name,codeId})
    data.features.forEach((item) => {
      geoCoordMap[item.properties.name] = item.properties.center;
    });
    convertData = convertDataCallback(geoCoordMap);
  } catch (error) {
    // 文件加载失败时的错误处理逻辑
    console.error(error);
  }
  return { geoCoordMap, convertData };
};

export const changConvertData = async ({ areaName, areaCode }) => {
  const cityId = areaCode;
  let change = true;
  const _cityName = areaName;
  const { geoCoordMap, convertData } = await dynamicLoadGeo({
    name: areaName,
    code: areaCode,
  });
  change = Object.keys(geoCoordMap)?.length > 0;

  if (change) {
    // boardModel.actions.update({
    //   convertData,
    //   cityId: `${cityId}000000`,
    //   cityName: _cityName,
    //   userRole,
    // });
  }
};
