import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapContext from "./store/map-context";
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl/maplibre';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import {CSVLoader} from '@loaders.gl/csv';
import {load} from '@loaders.gl/core';
import Header from "./components/Header";
import HomeView from "./views/HomeView";
import "mapbox-gl/dist/mapbox-gl.css";

import type {Color, PickingInfo, MapViewState} from '@deck.gl/core';

import {ConfigProvider} from 'antd';
import "./App.css";

import axios from 'axios';


// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -1.415727,
  latitude: 52.232395,
  zoom: 6.6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export const colorRange: Color[] = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

function getTooltip({object}: PickingInfo) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];
  const count = object.points.length;

  return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
    ${count} Accidents`;
}

type DataPoint = [longitude: number, latitude: number];




function App({
  mapStyle = MAP_STYLE,
  radius = 100,
  upperPercentile = 100,
  coverage = 1
}: {
  mapStyle?: string;
  radius?: number;
  upperPercentile?: number;
  coverage?: number;
}): JSX.Element {


  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

        const response = await axios.get(DATA_URL);
        const csvData = response.data.split('\n').slice(1); // Skip the header
        const parsedData = csvData.map(row => {
          const [lng, lat] = row.split(',');
          return { lng: parseFloat(lng), lat: parseFloat(lat) };
        });
        setData(parsedData);
    };

    fetchData();
  }, []);


  const points: DataPoint[] = data.map(d => [d.lng, d.lat]);


  const layers = [
    new HexagonLayer<DataPoint>({
      id: 'heatmap',
      colorRange,
      coverage,
      data:points,
      elevationRange: [0, 3000],
      elevationScale: data && data.length ? 50 : 0,
      extruded: true,
      getPosition: d => d,
      pickable: true,
      radius,
      upperPercentile,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51]
      },

      transitions: {
        elevationScale: 4000
      }
    })
  ];


  return (

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
      <DeckGL
      layers={layers}
      effects={[lightingEffect]}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
    >
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
      </ConfigProvider>
  );
}




export default App;


