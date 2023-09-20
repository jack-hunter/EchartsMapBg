export const geoCoordMap: Record<string, any> = {
  台湾省: [121.5135, 25.0308],
  黑龙江省: [127.9688, 45.368],
  内蒙古自治区: [110.3467, 41.4899],
  吉林省: [125.8154, 44.2584],
  北京市: [116.4551, 40.2539],
  辽宁省: [123.1238, 42.1216],
  河北省: [114.4995, 38.1006],
  天津市: [117.4219, 39.4189],
  山西省: [112.3352, 37.9413],
  陕西省: [109.1162, 34.2004],
  甘肃省: [103.5901, 36.3043],
  宁夏回族自治区: [106.3586, 38.1775],
  青海: [101.4038, 36.8207],
  新疆维吾尔自治区: [87.9236, 43.5883],
  西藏自治区: [91.11, 29.97],
  四川省: [103.9526, 30.7617],
  重庆市: [108.384366, 30.439702],
  山东省: [117.1582, 36.8701],
  河南省: [113.4668, 34.6234],
  江苏省: [118.8062, 31.9208],
  安徽省: [117.29, 32.0581],
  湖北省: [114.3896, 30.6628],
  浙江省: [119.5313, 29.8773],
  福建省: [119.4543, 25.9222],
  江西省: [116.0046, 28.6633],
  湖南省: [113.0823, 28.2568],
  贵州省: [106.6992, 26.7682],
  云南省: [102.9199, 25.4663],
  广东省: [113.12244, 23.009505],
  广西壮族自治区: [108.479, 23.1152],
  海南省: [110.3893, 19.8516],
  上海市: [121.4648, 31.2891],
};

export const convertData = (
  _data: string | any[],
  adjustXMultiple = 8.2,
  adjustXConstant = -126,
  adjustYMultiple = 9.5,
  adjustYConstant = 758
) => {
  const res: any[] = [];
  for (let i = 0; i < _data.length; i++) {
    // ------------此处的值需要自己手动调节,直到匹配------------
    let geoCoord;
    try {
      geoCoord = [
        geoCoordMap[_data[i].name][0] * adjustXMultiple + adjustXConstant,
        -geoCoordMap[_data[i].name][1] * adjustYMultiple + adjustYConstant,
      ];
    } catch (e) {
      console.error(`首页地图存在识别不到的市名称，请查看network传输数据及name是否匹配
name:"${_data[i]?.name}"`);
    }

    // -------------------------------------------------------
    if (geoCoord) {
      res.push({
        name: _data[i].name,
        value: geoCoord.concat(_data[i].value),
      });
    }
  }

  return res;
};