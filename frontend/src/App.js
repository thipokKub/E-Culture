import React, { Component } from 'react';
import MapComponent from './components/map';
import SimpleMap from './components/google_map';
import MyFancyComponent from './components/google_map_ver2'
import ShelterMap from './components/markers_map'
import ChatBox from './components/chat_box';
import styled from 'styled-components';
import ModalHelper from './helpers/modal-helper';

const ModalStore = ModalHelper.ModalStore;

const Layout = styled.section`
  display: flex;
  &::first-child {
    flex: 0 0 30vw;
    border: 1px solid #000;
  }
  &::nth-child(2) {
    flex: 0 0 100%;
    border: 1px solid #000;
  }
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
    console.log(this.state.modal)
    return (
      <Layout>
        <ChatBox />
        <section style={{
          height: "100vh",
          width: "70vw"
        }}>
        <ShelterMap />
          {/* <MyFancyComponent /> */}
          {/* <MyMapComponent isMarkerShown={false} />// Just only Map */}
        </section>
      </Layout>
    );
  }
}

export default App;
