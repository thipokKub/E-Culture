import React, { Component } from "react"
import { compose } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps"

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {

  return (
    <GoogleMap defaultZoom={7.5} defaultCenter={{ lat: 18.4819, lng: 99.0098}}>
      {props.markers.map(marker => {
        const onClick = props.onClick.bind(this, marker)
        // console.log(marker);
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            position={{ lat: marker.latitude, lng: marker.longitude }}
          >
            {props.selectedMarker === marker &&
              <InfoWindow>
                <div>
                  {marker.name}
                </div>
              </InfoWindow>}
            }
          </Marker>
        )
      })}
    </GoogleMap>
  )
})

export default class ShelterMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shelters: [],
      selectedMarker: false,
      markers: []
    }

    this.changeMarkers = this.changeMarkers.bind(this);
  }
  componentDidMount() {
    fetch("https://api.harveyneeds.org/api/v1/shelters?limit=20")
      .then(r => r.json())
      .then(data => {
        this.setState({ shelters: data.shelters })
      })
  }
  handleClick = (marker, event) => {
    // console.log({ marker })
    this.setState({ selectedMarker: marker })
  }
  changeMarkers(){
      console.log("Change Markers");
      if(this.state.markers.length){
        this.setState({markers:[] });
      }
      else{
        this.setState({markers: [{id: "1", name: "A", latitude: 19.4819, longitude: 99.0098},
        {id: "2", name: "B", latitude: 18.6565, longitude: 98.9627},
        {id: "3", name: "C", latitude: 18.5107, longitude: 98.8525},
        {id: "4", name: "D", latitude: 18.6176, longitude: 98.7791},
        ]});
      }
  }
   getCurrentLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((myLocation)=>{
            console.log(myLocation);
        });
        
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
   }
  render() {
    return (
    <div style={{ height: "100%", width: "100%"}}>
    <button onClick={this.changeMarkers}>Toggle Markers</button>
    <button onClick={this.getCurrentLocation}>Get myLocation</button>
      <MapWithAMarker
        selectedMarker={this.state.selectedMarker}
        markers={this.state.markers}
        onClick={this.handleClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDGdIFwgysQcG2IBTGPpwlrqWHCBSu6wvI&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      </div>
    )
  }
}