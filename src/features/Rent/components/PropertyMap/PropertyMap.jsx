import React, { useEffect, useRef, useState } from "react";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import MapPopupDetails from "features/Rent/components/PropertyMap/MapPopup";
import { Overlay } from "ol";
import Feature from "ol/Feature";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { defaults as defaultControls } from "ol/control.js";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import LayerTile from "ol/layer/Tile.js";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import SourceOSM from "ol/source/OSM.js";
import { Icon, Style } from "ol/style";

const ZoomLevel = {
  xs: 15,
  sm: 12,
  md: 10,
  lg: 5,
  xl: 1,
  none: 0,
};

const PropertyMap = ({
  location = { lon: -90.7129, lat: 37.0902 }, // USA default
  onLocationChange,
  subtitle,
  height = "30vh",
  disabled = false,
  editMode = false,
  address = "",
  propertyName = "",
  propertyLocation = { lat: 0, lon: 0 },
  amenities = [],
}) => {
  const mapRef = useRef();
  const theme = useTheme();
  const markerRef = useRef();

  // for popup and overlay
  const popupRef = useRef();
  const overlayRef = useRef();
  const amenityLayerRef = useRef();
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  useEffect(() => {
    const initialCenter = fromLonLat([location?.lon, location?.lat]);
    const zoom = ZoomLevel.xl;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new LayerTile({
          source: new SourceOSM({
            attributions: [
              '© <a href="https://geocode.maps.co/" style="color: inherit; text-decoration: none;">Map data contributors</a>.',
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
        zoom,
      }),
    });

    // Create OpenLayers Overlay for popup
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: false,
      autoPanAnimation: {
        duration: 250,
      },
      positioning: "bottom-center", // Position popup above the marker
      offset: [0, -10], // Small offset above the marker
    });

    map.addOverlay(overlay);
    overlayRef.current = overlay;

    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });

    const amenityLayer = new VectorLayer({
      source: new VectorSource(),
      minZoom: ZoomLevel.md,
    });

    amenityLayerRef.current = amenityLayer;

    map.addLayer(vectorLayer);
    map.addLayer(amenityLayer);
    // add amenities to amenity layer
    amenities.forEach((amenity) => {
      addMarkers(
        map,
        amenityLayer, // use amenity layer
        {
          lon: amenity?.lon,
          lat: amenity?.lat,
        },
        null, // Don't track amenity markers in markerRef
        amenity,
      );
    });

    // add property to main vector layer
    addMarkers(map, vectorLayer, location, markerRef);

    // add ability to hover
    map.on("click", function (event) {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature;
      });

      if (feature && feature.get("amenity")) {
        const currentAmenity = feature.get("amenity");
        setSelectedAmenity(currentAmenity);
        map.getView().animate({
          center: fromLonLat([currentAmenity.lon, currentAmenity.lat]),
          zoom: ZoomLevel.sm + 2,
          duration: 500,
        });

        overlay.setPosition(event.coordinate);
      } else {
        setSelectedAmenity(null);
        overlay.setPosition(undefined);
      }
    });

    if (editMode) {
      map.on("click", function (event) {
        const clickedCoordinate = toLonLat(event.coordinate);
        const [lon, lat] = clickedCoordinate;
        updateMarker(vectorLayer, lon, lat, markerRef);
        if (onLocationChange) {
          onLocationChange({ lon, lat });
        }
      });
    }

    return () => {
      map.setTarget(null);
    };
  }, [location, onLocationChange, amenities]);

  if (disabled) {
    return null;
  }

  return (
    <Stack
      sx={{
        height: { xs: "100%", sm: height },
        width: { xs: "100%", sm: "100%" },
      }}
    >
      <Typography variant="caption">{subtitle}</Typography>
      <Box
        sx={{
          height: "inherit",
          width: "inherit",
          "& .ol-viewport": {
            borderRadius: 1,
          },
          "& .ol-attribution": {
            display: "flex",
            flexDirection: "row",
            backgroundColor: theme.palette.background.paper,
            fontSize: "0.65rem",
            opacity: 0.7,
          },
          "& .ol-attribution > button": {
            display: "none",
          },
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
        <Box sx={{ height: "100%", width: "100%" }} ref={mapRef} />
        <Box
          sx={{
            position: "relative",
            bottom: 18,
            backgroundColor: theme.palette.background.paper,
            opacity: 0.7,
            px: 1,
            fontSize: "0.7rem",
            pointerEvents: "none",
          }}
        >
          {address}
        </Box>
        <Box
          ref={popupRef}
          sx={{
            position: "absolute",
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            borderRadius: 1,
            padding: 1,
            minWidth: "200px",
            display: selectedAmenity ? "block" : "none",
            pointerEvents: "none", // Allow clicking through
          }}
        >
          <MapPopupDetails
            propertyName={propertyName}
            propertyLocation={propertyLocation}
            selectedAmenity={selectedAmenity}
          />
        </Box>
      </Box>
    </Stack>
  );
};

/**
 * Add markers to the vector layer and center the map view.
 *
 * @param {Object} map The OpenLayers map instance
 * @param {Object} vectorLayer The OpenLayers vector layer to add markers to
 * @param {Object} location The location to add a marker for
 */
const addMarkers = (map, vectorLayer, location, markerRef, amenity) => {
  if (!location) return;

  const type = amenity?.type || "location";

  const { lon, lat } = location;
  if (lon && lat) {
    const geometry = new Point(fromLonLat([lon, lat]));
    const feature = new Feature({
      geometry,
      notesInfo: location,
      amenity,
    });

    const markerStyle = new Style({
      image: new Icon({
        src: type === "location" ? "/icons/location.svg" : `/icons/${type}.svg`,
        scale: 0.4,
        anchor: [0.5, 0.5],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        crossOrigin: "anonymous",
      }),
    });

    feature.setStyle(markerStyle);
    vectorLayer.getSource().addFeature(feature);

    if (type === "location") {
      // only zoom and save location for property; ref stays current
      map.getView().setCenter(fromLonLat([lon, lat]));
      map.getView().setZoom(ZoomLevel.sm);
      markerRef.current = feature;
    }
  }
};

/**
 * Update the position of the marker on the map.
 *
 * @param {Object} vectorLayer The vector layer containing the marker
 * @param {Number} lon The longitude of the new location
 * @param {Number} lat The latitude of the new location
 */
const updateMarker = (vectorLayer, lon, lat, markerRef) => {
  const geometry = new Point(fromLonLat([lon, lat]));
  if (markerRef.current) {
    markerRef.current.setGeometry(geometry);
  } else {
    // If no marker exists, add a new one
    const feature = new Feature({ geometry });
    vectorLayer.getSource().addFeature(feature);
    markerRef.current = feature;
  }
};

export default PropertyMap;
