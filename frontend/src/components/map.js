import React from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiY2hhd2l0MjM1IiwiYSI6ImNqbGk3a3lqejFxYWozcHM1bnFwNWptaTgifQ.uL1vLO_iucOpUk31CFrmAQ"
});

// in render()
const main_center = [100.610275, 14.797778];
const size = {height: "100vh", width: "70vw"};
const mystyle = "mapbox://styles/mapbox/streets-v9";
export default (prop) => {
    return (
        <Map
            style={mystyle}
            containerStyle={size}
            center={main_center}>
        <Layer
        type="symbol"
        id="marker"
        layout={{ "icon-image": "marker-15" }}>
        <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
        </Layer>
        </Map>
    );
}
