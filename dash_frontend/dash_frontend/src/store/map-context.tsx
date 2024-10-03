import React from "react";
import mapboxgl from "mapbox-gl";
import { Scene } from "@antv/l7";
interface MapSceneContext {
  map: mapboxgl.Map | null;
  scene: Scene | null;
}
const MapContext = React.createContext<MapSceneContext>({
  map: null,
  scene: null,
});

export default MapContext;
