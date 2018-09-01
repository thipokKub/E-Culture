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
    this.state = { modal: false };
    ModalStore.subscribe(() => {
      this.setState({ modal: ModalStore.getState() })
    })
  }

  render() {
    return (
      [
        <Layout key="layout" scollable={this.state.modal}>
          <ChatBox />
          <section style={{
            height: "100vh",
            width: "70vw"
          }}>
            <ShelterMap />
          </section>
        </Layout>,
        this.state.modal && (
          <Masked key="backdrop">
            <Modal key="modal" />
          </Masked>
        )
      ]
    );
  }
}

export default App;
