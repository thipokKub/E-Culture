import React, { Component } from 'react';
import MapComponent from './components/map';
import ChatBox from './components/chat_box';
import styled from 'styled-components';

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
  render() {
    return (
      <Layout>
        <ChatBox />
        <section>
          <MapComponent />
        </section>
      </Layout>
    );
  }
}

export default App;
