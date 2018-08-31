import React, { Component } from 'react';
import Bubble from './chat_bubble';
import styled from 'styled-components';

const ChatBoxStyled = styled.section`
    width: 30vw;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid #000;
`

class ChatBox extends Component {
    render() {
        return (
            <section style={{ display: 'flex', justifyContent: 'center'}}>
                <ChatBoxStyled>
                    <Bubble
                        speaker="me"
                        text="Hello"
                    />
                </ChatBoxStyled>
            </section>
        );
    }
}

export default ChatBox;