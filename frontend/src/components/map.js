import React ,{ Component }from 'react';
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";

const token = "pk.eyJ1IjoiY2hhd2l0MjM1IiwiYSI6ImNqbGk3a3lqejFxYWozcHM1bnFwNWptaTgifQ.uL1vLO_iucOpUk31CFrmAQ";
const main_center = [100.610275, 14.797778];
const size = {height: "100vh", width: "70vw"};
const mystyle = "mapbox://styles/mapbox/streets-v9";

const Map = ReactMapboxGl({
  accessToken: token
});
// in render()
class MapComponent extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Map
            style={mystyle}
            containerStyle={size}
            center={main_center}>
        <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
         <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
        </Layer>
        <Marker
            coordinates={main_center}
            anchor="bottom">
            CCCCCC
            </Marker>
        </Map>
        );
    }
}
export default MapComponent;