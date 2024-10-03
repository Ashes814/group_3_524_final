import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapContext from "./store/map-context";
import { Scene, Mapbox } from "@antv/l7";
import Header from "./components/Header";
import HomeView from "./views/HomeView";
import "mapbox-gl/dist/mapbox-gl.css";

import {ConfigProvider} from 'antd';
import "./App.css";


function App(): JSX.Element {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  useEffect(() => {
    // Initial Mapbox Token
    const token: string = "pk.eyJ1IjoiYXNoZXMxMjMiLCJhIjoiY20xYThmMmhmMW5yazJ2czhyc3hzNms1ayJ9.OKIjDhcqf28oPqu7XnMKog";
    mapboxgl.accessToken = token;

    // Initial Mapbox map object & Antv L7 Scene Object
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-1, 53],
      zoom: 6.5,
      projection: "mercator",
    });
    const scene = new Scene({
      id: "map",
      map: new Mapbox({
        mapInstance: map,
      }),
      logoVisible: false,
    });

    // Updating China Boundary
    map.on("style.load", () => {
      map.setFog({});
      // 中华疆土，一寸不让
      map.setFilter("admin-0-boundary-disputed", [
        "all",
        ["==", ["get", "disputed"], "true"],
        ["==", ["get", "admin_level"], 0],
        ["==", ["get", "maritime"], "false"],
        ["match", ["get", "worldview"], ["all", "CN"], true, false],
      ]);
      map.setFilter("admin-0-boundary", [
        "all",
        ["==", ["get", "admin_level"], 0],
        ["==", ["get", "disputed"], "false"],
        ["==", ["get", "maritime"], "false"],
        ["match", ["get", "worldview"], ["all", "CN"], true, false],
      ]);
      map.setFilter("admin-0-boundary-bg", [
        "all",
        ["==", ["get", "admin_level"], 0],
        ["==", ["get", "maritime"], "false"],
        ["match", ["get", "worldview"], ["all", "CN"], true, false],
      ]);
    });

    // Setting map and scene state
    setMap(map);
    setScene(scene);
  }, []);

  return (
    <MapContext.Provider value={{ map, scene }}>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: "rgba(245, 96, 106, 1)",
            borderRadius: 2,
    
            // Alias Token
            // colorBgContainer: '#f6ffed',
          },
        }}
      >
      <Header />
      {/* <Focus /> */}
      <HomeView />
      <div id="map"></div>
      </ConfigProvider>
    </MapContext.Provider>
  );
}

export default App;
