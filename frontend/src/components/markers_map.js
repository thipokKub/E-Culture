import React, { Component } from "react"
import { compose, withProps, lifecycle } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer
} from "react-google-maps"

const google = window.google;

const MapWithAMarker = compose(
  withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDGdIFwgysQcG2IBTGPpwlrqWHCBSu6wvI",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: '100vh' }} />,
    }),
    withScriptjs,
    withGoogleMap,
  lifecycle({
    componentDidMount() {
      if(this.props.isRoute) {
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
          origin: new google.maps.LatLng(this.props.start.lat, this.props.start.lon),
          destination: new google.maps.LatLng(this.props.dest.lat, this.props.dest.lon),
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result,
            });
            console.log(result)
          } else {
            console.error(`error fetching directions ${result}`);
          }
        });
      }
    }
  }))(props => {
  const isRoute = props.isRoute ? true : false;
  return (
    <GoogleMap defaultZoom={7.5} defaultCenter={{ lat: 18.4819, lng: 99.0098}}
      onClick={(e) => {
        props.onChangePos && props.onChangePos(e);
      }}
    >
      {
        (isRoute) && (props.directions && <DirectionsRenderer directions={props.directions} />)
      }
      {(!isRoute) && props.markers.concat([{
        id: "0",
        latitude: props.currentPos.lat,
        longitude: props.currentPos.lon,
        name: "me"
      }]).map(marker => {
        const onClick = props.onClick.bind(this, marker)
        // console.log(marker);
        return (
          <Marker
            icon={{ url: marker.name === "me" ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" :"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}}
            key={marker.id}
            onClick={onClick}
            position={{ lat: marker.latitude, lng: marker.longitude }}
          >
            {(props.selectedMarker.id === marker.id && marker.name !== "me") &&
              <InfoWindow>
                <div>
                  {marker.name}
                  <hr />
                  This is a test string
                  <img alt="thumbnail" src="https://via.placeholder.com/100x100" />
                </div>
              </InfoWindow>}
          </Marker>
        )
      })}
      {/* {props.currentLocation.map((currentlocation) => {
          return (
            <Marker 
                key={marker.id}
                icon={{url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}}> 
                position={currentlocation}
            </Marker>
          );
        })} */}
    </GoogleMap>
  )
})

const test = [{ id: "1", name: "นางจันทร์ดี      อินทพันธ์  ", latitude: 17.6116, longitude: 99.2158 }]

const marker1 = [
  { id: "1", name: "A", latitude: 19.4819, longitude: 99.1098 },
  { id: "2", name: "B", latitude: 18.2565, longitude: 98.3627 },
  { id: "3", name: "C", latitude: 18.1107, longitude: 98.5525 },
  { id: "4", name: "D", latitude: 18.6176, longitude: 98.3791 },
  { id: "5", name: "นางจันทร์ดี      อินทพันธ์  ", latitude: 17.6116, longitude: 99.2158 }
];

const marker2 = [
  { id: "1", name: "A", latitude: 19.4819, longitude: 99.0098 },
  { id: "2", name: "B", latitude: 18.6565, longitude: 98.9627 },
  { id: "3", name: "C", latitude: 18.5107, longitude: 98.8525 },
  { id: "4", name: "D", latitude: 18.6176, longitude: 98.7791 },
];

export default class ShelterMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shelters: [],
      selectedMarker: false,
      markers: marker1,
      markerState: 0,
    }

    this.changeMarkers = this.changeMarkers.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
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
  changeMarkers() {
      if(this.state.markerState === 0){
        this.setState({ markers: marker1, markerState: 1 });
      }
      else{
        this.setState({markers: marker2, markerState: 0});
      }
  }
   getCurrentLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            const myLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
            // console.log(myLocation);
            this.setState({currentLocation: [ myLocation ]});
                            // showCurrentlocation: true});
        });
        
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
   }
  render() {
    let data = this.props.data ? this.props.data : [];
    data = data.map((it, idx) => ({
      id: `${idx + 1}`,
      name: it.title,
      latitude: it.lat,
      longitude: it.lon
    }))

    return (
      <div style={{ height: "100%", width: "100%"}}>
        <span>Recentering: </span>
        <button onClick={this.props.onToggleRecenter}>{this.props.isRecentering ? "ON" : "OFF"}</button>
        <MapWithAMarker
          onChangePos={(e) => {this.props.isRecentering && this.props.onChangePos(e)}}
          onRouting={(e) => {}}
          selectedMarker={this.state.selectedMarker}
          currentPos={this.props.currentPos}
          markers={data}
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