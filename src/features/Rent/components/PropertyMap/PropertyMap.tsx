import { useEffect, useRef } from "react";

import { Box, Stack, Typography } from "@mui/material";
import Feature from "ol/Feature";
import Map from "ol/Map";
import MapBrowserEvent from "ol/MapBrowserEvent";
import View from "ol/View";
import { defaults as defaultControls } from "ol/control";
import { Geometry } from "ol/geom";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import OSM from "ol/source/OSM";
import { Icon, Style } from "ol/style";
import { TGeoLocationCoordinates } from "src/types";

const ZoomLevel = {
  xs: 15,
  md: 10,
  lg: 5,
  xl: 1,
  none: 0,
} as const;

// TPropertyMapProps ...
export type TPropertyMapProps = {
  location: TGeoLocationCoordinates;
  onLocationChange?: (value: TGeoLocationCoordinates) => void;
  subtitle: string;
  height?: string;
  disabled?: boolean;
  editMode?: boolean;
};

const PropertyMap = ({
  location = { lon: -90.7129, lat: 37.0902 }, // USA default
  onLocationChange,
  subtitle,
  height = "15vh",
  disabled = false,
  editMode = false,
}: TPropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<Feature<Point> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialCenter = fromLonLat([location.lon, location.lat]);

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: [
              '© <a href="https://geocode.maps.co/">Map data contributors</a>.',
              "© OpenStreetMap contributors.",
            ],
          }),
        }),
      ],
      controls: defaultControls({
        attribution: true,
        rotate: false,
        zoom: false,
        attributionOptions: {
          collapsible: false,
          collapsed: true,
        },
      }),
      view: new View({
        center: initialCenter,
        zoom: ZoomLevel.xl,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource<Feature<Geometry>>(),
    });

    map.addLayer(vectorLayer);

    addMarker(map, vectorLayer, location, markerRef);

    if (editMode) {
      map.on("click", (event: MapBrowserEvent<UIEvent>) => {
        const [lon, lat] = toLonLat(event.coordinate);
        updateMarker(vectorLayer, lon, lat, markerRef);
        onLocationChange?.({ lon, lat });
      });
    }

    return () => {
      map.setTarget(undefined);
    };
  }, [location, onLocationChange, editMode]);

  if (disabled) return null;

  return (
    <Stack
      sx={{
        height: { xs: "100%", sm: height },
        width: "100%",
      }}
    >
      <Typography variant="caption">{subtitle}</Typography>
      <Box
        sx={{
          height: "inherit",
          width: "inherit",
          "& .ol-viewport": { borderRadius: 1 },
          "& .ol-attribution": {
            display: "flex",
            flexDirection: "row",
            backgroundColor: "lightgrey",
            fontSize: "0.65rem",
            opacity: 0.7,
          },
          "& .ol-attribution > button": { display: "none" },
          "& .ol-attribution > ul": {
            display: "flex",
            flexDirection: "row",
            listStyle: "none",
            alignItems: "center",
            padding: "0rem 1rem",
            margin: 0,
            gap: 1,
          },
        }}
      >
        <Box ref={mapRef} sx={{ height: "100%", width: "100%" }} />
      </Box>
    </Stack>
  );
};

// addMarker ...
const addMarker = (
  map: Map,
  vectorLayer: VectorLayer<VectorSource<Feature<Geometry>>>,
  location: TGeoLocationCoordinates,
  markerRef: React.MutableRefObject<Feature<Point> | null>,
) => {
  const { lon, lat } = location;
  if (lon == null || lat == null) return;

  const geometry = new Point(fromLonLat([lon, lat]));
  const feature = new Feature<Point>({ geometry });

  feature.setStyle(
    new Style({
      image: new Icon({
        src: "/location.svg",
        scale: 0.4,
        anchor: [0.5, 0.5],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        crossOrigin: "anonymous",
      }),
    }),
  );

  vectorLayer.getSource()?.addFeature(feature);
  map.getView().setCenter(fromLonLat([lon, lat]));
  map.getView().setZoom(ZoomLevel.xs);

  markerRef.current = feature;
};

// updateMarker ...
const updateMarker = (
  vectorLayer: VectorLayer<VectorSource<Feature<Geometry>>>,
  lon: number,
  lat: number,
  markerRef: React.MutableRefObject<Feature<Point> | null>,
) => {
  const geometry = new Point(fromLonLat([lon, lat]));

  if (markerRef.current) {
    markerRef.current.setGeometry(geometry);
  } else {
    const feature = new Feature<Point>({ geometry });
    vectorLayer.getSource()?.addFeature(feature);
    markerRef.current = feature;
  }
};

export default PropertyMap;
