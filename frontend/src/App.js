import React, { Component } from 'react';
import MapComponent from './components/map';
import SimpleMap from './components/google_map';
import MyFancyComponent from './components/google_map_ver2'
import ShelterMap from './components/markers_map'
import MapWithADirectionsRenderer from './components/direction_map'
import ChatBox from './components/chat_box';
import styled from 'styled-components';
import ModalHelper from './helpers/modal-helper';
import Modal from './components/modal';
import { DirectionsRenderer } from 'react-google-maps';

const { ModalStore } = ModalHelper;

const Layout = styled.section`
  display: flex;
  overflow: hidden;

  ${props => props.scollable ? "overflow: hidden;" : ""}

  &::first-child {
    flex: 0 0 30vw;
    border: 1px solid #000;
  }
  &::nth-child(2) {
    flex: 0 0 100%;
    border: 1px solid #000;
  }
`

const Masked = styled.div`
  width: 100vw;
  /* min-height: 100vh;
  position: absolute; */

  height: 100vh;
  position: fixed;
  overflow-y: scroll;

  display: flex;
  justify-content: center;
  /* align-items: center; */
  padding: 50px 0px 50px 0px;
  
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  z-index: 1000;
`

const Banner = styled.nav`
  height: 60px;
  background-color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modal: null,
      pointPos: {
        lat: -1,
        lon: -1
      },
      isRecentering: false,
      isRouting: false,
      routeState: "A",
      pointA: {
        lat: -1,
        lon: -1
      },
      pointB: {
        lat: -1,
        lon: -1
      }
    };
    ModalStore.subscribe(() => {
      this.setState({ ...ModalStore.getState() })
    })
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          pointPos: {
            lat: Math.round(100000 * position.coords.latitude) / 100000,
            lon: Math.round(100000 * position.coords.longitude) / 100000
          },
          pointA: {
            lat: Math.round(100000 * position.coords.latitude) / 100000,
            lon: Math.round(100000 * position.coords.longitude) / 100000
          },
          pointB: {
            lat: Math.round(100000 * position.coords.latitude) / 100000,
            lon: Math.round(100000 * position.coords.longitude) / 100000
          }
        });
      });
    }
  }

  onToggleRoutePoint = () => {
    this.setState({ routeState: this.state.routeState === "A" ? "B" : "A"})
  }

  onSetRoutePoint = (lat, lon) => {
    this.setState({
      [this.state.routeState === "A" ? "pointA" : "pointB"]: { lat, lon }
    })
  }

  onToggleRecenter = () => {
    this.setState({
      isRecentering: !this.state.isRecentering
    })
  }

  onChangePos = (e) => {
    this.setState({
      pointPos: {
        lat: e.latLng.lat(),
        lon: e.latLng.lng()
      }
    })
  }

  render() {
    // const listItem = this.state.item ? Array.from(new Array(14).keys()).map((idx) => (
    //   { ...this.state.item.data,
    //     title: `${this.state.item.data.title} ${idx}`,
    //     lat: Math.round(10000000*(this.state.item.data.lat + 3*(Math.random() - 0.5)))/10000000,
    //     lon: Math.round(10000000*(this.state.item.data.lon + 3*(Math.random() - 0.5)))/10000000
    //   }
    // )).concat([{ ...this.state.item.data }]) : [];

    const listItem = this.state.item ? this.state.item.data : []

    return (
      [
        <Banner key="Banner">
          <span>Title</span>
        </Banner>,
        <Layout key="layout" scollable={this.state.isOpem}>
          <ChatBox
            pointPos={this.state.pointPos}
          />
          <section style={{
            height: "calc(100vh - 100px)",
            width: "70vw"
          }}>
            {
              // <MapWithADirectionsRenderer start={{lat: 18.6565, lon: 98.9627}} dest={{lat: 18.6176, lon: 98.7791}}/>
            }
            <ShelterMap
              data={listItem}
              onChangePos={this.onChangePos}
              onToggleRecenter={this.onToggleRecenter}
              isRecentering={this.state.isRecentering}
              currentPos={this.state.pointPos}
            />
          </section>
        </Layout>,
        this.state.isOpen && (
          <Masked key="backdrop">
            <Modal
              key="modal"
              {...this.state.item}
              listItem={listItem}
            />
          </Masked>
        )
      ]
    );
  }
}

export default App;
