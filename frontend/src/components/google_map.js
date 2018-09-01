import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const API_KEY = "AIzaSyDGdIFwgysQcG2IBTGPpwlrqWHCBSu6wvI";

class SimpleMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      title: 'Intiial State',
      center: {
        lat: 14.797778,
        lng: 100.610275
      },
      zoom: 15
    }
    this.changeState = this.changeState.bind(this);
  };
  static defaultProps = {
    center: {
      lat: 14.797778,
      lng: 100.610275
    },
    zoom: 15
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_KEY }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <AnyReactComponent
            lat={14.797778}
            lng={100.610275}
            text={this.state.title}
          />
        </GoogleMapReact>
        <button onClick={this.changeState}> My button </button>
      </div>
    );
  }
  changeState(event){
    this.setState({
      title: 'Second State'
    });
  }
}

export default SimpleMap;