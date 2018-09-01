import React from "react"
import fetch from "isomorphic-fetch";
import { compose, withProps, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer'
const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDGdIFwgysQcG2IBTGPpwlrqWHCBSu6wvI&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 14.797778, lng: 100.610275 }}
  >
  <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          key={marker.lat}
          position={{ lat: marker.lat, lng: marker.lng }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
)

export default class MyFancyComponent extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        isMarkerShown: false,
        markers: [{ lat: 14.797778, lng: 100.610275 },
                    { lat: 30.797778, lng: 100.610275 },
                    { lat: 60.797778, lng: 100.610275 }]
      }
  }
  componentDidMount() {
    this.delayedShowMarker()
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {
    return (
      <MyMapComponent
        // isMarkerShown={this.state.isMarkerShown}
        // onMarkerClick={this.handleMarkerClick}
        markers={this.state.markers}
      />
    )
  }
}

/*
    {{props.markers.map(marker => (
        <Marker
          key={marker.lat}
          position={{ lat: marker.lat, lng: marker.lng }}
        />
      ))}}
{/{props.isMarkerShown && <Marker position={{ lat: 14.797778, lng: 100.610275 }} onClick={props.onMarkerClick} />} }
*/