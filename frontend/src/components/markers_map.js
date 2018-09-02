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
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  ${props => !props.isOn ? "background-color: #FF4039;" : "background-color: #90FC4A;"}

  &:hover {
    filter: brightness(0.9);
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  }

  &:active {
    filter: brightness(0.8);
    box-shadow: none;
  }
`

const google = window.google;

const styledMapType = [
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": "1.00"
      },
      {
        "color": "#a1d8ff"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#f3faff"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "gamma": "0.01"
      },
      {
        "lightness": "0"
      },
      {
        "color": "#3a6279"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "saturation": -31
      },
      {
        "lightness": -33
      },
      {
        "weight": "0.20"
      },
      {
        "gamma": 0.8
      },
      {
        "visibility": "on"
      },
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": 30
      },
      {
        "saturation": 30
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "saturation": 20
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": 20
      },
      {
        "saturation": -20
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": 10
      },
      {
        "saturation": -30
      },
      {
        "visibility": "off"
      },
      {
        "color": "#b8d4e4"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#6fb6e0"
      },
      {
        "weight": "0.39"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "lightness": -20
      }
    ]
  }
]

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
    <GoogleMap
      defaultZoom={7.5}
      defaultCenter={{ lat: 18.4819, lng: 99.0098}}
      options={{ styles: styledMapType }}
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