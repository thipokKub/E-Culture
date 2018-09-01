import React, { Component } from 'react';
import Bubble from './chat_bubble';
import styled from 'styled-components';
import ModalHelper from '../helpers/modal-helper';

const { ModalStore, types } = ModalHelper;

const ChatBoxStyled = styled.section`
    width: 30vw;
    height: 100%;
    display: flex;
    justify-content: center;
    border: 1px solid #000;
    position: relative;
    height: 100vh;
    overflow-y: scroll;

    section.scroll-chat {
        display: flex;
        flex: 0 1 90%;
        flex-direction: column;
        width: 90%;
        transform: translateX(-5px);
    }
`

class ChatBox extends Component {
    render() {
        return (
            <section style={{ display: 'flex', justifyContent: 'center'}}>
                <ChatBoxStyled>
                    <section className="scroll-chat">
                        <Bubble
                            speaker="me"
                            text="Hello"
                        />
                        <Bubble
                            speaker="robot"
                            text="Hi"
                        />
                        <Bubble
                            speaker="me"
                            text="Hello"
                        />
                        <Bubble
                            speaker="robot"
                            text="Hi"
                        />
                    </section>
                </ChatBoxStyled>
                <button onClick={() => { ModalStore.dispatch({ type: types.TOGGLE }); }}>Test</button>
            </section>
        );
    }
}

export default ChatBox;