import { useEffect, useState } from "react";
import ChinaMap from "./ChinaMap";
import AreaMap from "./AreaMap";
import { convertData } from "./ChinaMap/utils/china";
import { changConvertData } from "./AreaMap/utils";
import "./index.less";

export type LevelObj = {
  provinceCode?: string;
  cityCode?: string;
  areaCode: string;
  areaName: string;
  convertData?: (data: any) => any
};

export default function HomePage() {
  const [levelObj, setLevelObj] = useState<LevelObj>({
    provinceCode: undefined,
    cityCode: undefined,
    areaCode: "1",
    areaName: "中国",
  });

  useEffect(() => {
    if (levelObj.provinceCode) {
      changConvertData({
        areaName: levelObj.areaName,
        areaCode: levelObj.areaCode,
      });
    }
  }, [levelObj]);

  return (
    <div className="map">
      {levelObj.provinceCode ? (
        <AreaMap levelObj={levelObj} setLevelObj={setLevelObj} key={levelObj.areaCode} />
      ) : (
        <ChinaMap levelObj={levelObj} setLevelObj={setLevelObj} />
      )}
    </div>
  );
}
