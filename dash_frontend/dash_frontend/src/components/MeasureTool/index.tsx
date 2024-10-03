import React, { useContext, useEffect, useState } from "react";
import { DrawPolygon, DrawRect, DrawCircle, DrawLine } from "@antv/l7-draw";
import { Popover } from "antd";
import MapContext from "../../store/map-context";
import "./index.css";

export const MeasureTool = ({ drawTools }) => {
  const { scene, map } = useContext(MapContext);
  const tools = [
    "drawPolygonTool",
    "drawRectTool",
    "drawCircleTool",
    "line",
    "delete",
  ];

  const popperStyle = {
    backgroundColor: "#53697670",
    color: "#fff",
    width: 150,
    border: "1px solid #fff",
  };
  const content = (
    <div className="popover-w">
      {tools.map((tool, index) => {
        return (
          <i
            className={`iconfont query-item icon-${tool}`}
            key={index}
            onClick={() => {
              activeTool(tool);
            }}
          ></i>
        );
      })}
    </div>
  );
  const initTool = () => {
    tools.forEach((tool) => {
      switch (tool) {
        case "drawPolygonTool":
          drawTools[tool] = new DrawPolygon(scene, {
            //展示面积
            areaOptions: {},
          });
          break;
        case "drawRectTool":
          drawTools[tool] = new DrawRect(scene, {
            //展示面积
            areaOptions: {},
          });
          break;
        case "drawCircleTool":
          drawTools[tool] = new DrawCircle(scene, {
            //展示面积
            areaOptions: {},
          });
          break;
        case "line":
          // 需要注意的是这里需要指定距离测量的参数
          drawTools[tool] = new DrawLine(scene, {
            distanceOptions: {
              // 是否展示总距离
              showTotalDistance: false,
              // 是否展示一段的距离
              showDashDistance: true,
              // 展示的格式
              format: (meters) => {
                if (meters >= 1000) {
                  return +(meters / 1000).toFixed(2) + "km";
                } else {
                  return +meters.toFixed(2) + "m";
                }
              },
            },
          });
          break;
        default:
          break;
      }
    });
  };
  useEffect(() => {
    if (scene) {
      initTool();
    }
  }, []);
  const stopDrawing = () => {
    // 清除所有绘制工具
    for (let key in drawTools) {
      const tool = drawTools[key];
      tool.clear();
      tool.disable();
      tool.removeActiveFeature();
    }
  };

  const activeTool = (type) => {
    // 先清除
    stopDrawing();
    initTool();
    if (type === "delete") {
      for (let key in drawTools) {
        const tool = drawTools[key];
        tool.clear();
        tool.disable();
        tool.removeActiveFeature();
      }
      return;
    }
    const activedTool = drawTools[type];
    if (activedTool) {
      activedTool.enable();
    }
  };
  return (
    <>
      <Popover
        content={content}
        title=""
        placement="top"
        trigger="click"
        overlayInnerStyle={popperStyle}
      >
        <div className="item">
          <button className="btn-toggle">
            <i className="iconfont icon-paint"></i>
          </button>
        </div>
      </Popover>
    </>
  );
};
