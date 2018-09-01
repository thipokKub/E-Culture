import React, { Component } from 'react';
import MapComponent from './components/map';
import SimpleMap from './components/google_map';
import MyFancyComponent from './components/google_map_ver2'
import ShelterMap from './components/markers_map'
import ChatBox from './components/chat_box';
import styled from 'styled-components';
import ModalHelper from './helpers/modal-helper';
import Modal from './components/modal';

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modal: null
    };
    ModalStore.subscribe(() => {
      this.setState({ ...ModalStore.getState() })
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
        <Layout key="layout" scollable={this.state.isOpem}>
          <ChatBox />
          <section style={{
            height: "100vh",
            width: "70vw"
          }}>
            <ShelterMap
              data={listItem}
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
