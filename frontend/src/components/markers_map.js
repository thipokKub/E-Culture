import React, { Component } from "react"
import { compose, withProps, lifecycle } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer
} from "react-google-maps";
import styled from 'styled-components';

const Btn = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 6px;
  left: 190px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 800;
  ${props =>! props.isOn ? "background-color: #FF4039;" : "background-color: #6BFF6E;"}

  &:hover {
    filter: brightness(0.9);
  }

  &:active {
    filter: brightness(0.8);
  }
`

const google = window.google;
const MapWithAMarker = compose(
  withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDGdIFwgysQcG2IBTGPpwlrqWHCBSu6wvI",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: 'calc(100vh - 60px)' }} />,
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
                  <h3>{marker.name}</h3>
                  <hr />
                  <div style={{ display: 'flex'}}>
                    <img alt="thumbnail" src={marker.media[0].thumb_pic} width={90} height={90}/>
                    <div style={{ padding: '0px 0px 0px 10px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '125px', height: '90px'}}>
                      <span><b>จังหวัด</b>&nbsp;{marker.province}<br /></span>
                      <span><b>อำเภอ</b>&nbsp;{marker.amphoe}<br /></span>
                      <span><b>ตำบล</b>&nbsp;{marker.tambon}<br /><br /></span>
                      <span><b>ระยะทาง</b>&nbsp;{Math.round(100*marker.dist)/100}&nbsp;กม.</span>
                    </div>
                  </div>
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
      ...it,
      id: `${idx + 1}`,
      name: it.title,
      latitude: it.lat,
      longitude: it.lon
    }))

    return (
      <div style={{ height: "100%", width: "100%", position: 'relative'}}>
        <Btn
          onClick={this.props.onToggleRecenter}
          isOn={this.props.isRecentering}
        >
          {this.props.isRecentering ? "ON" : "OFF"}
        </Btn>
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