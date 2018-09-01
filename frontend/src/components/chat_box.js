import React, { Component } from 'react';
import Bubble from './chat_bubble';
import styled from 'styled-components';
import ModalHelper from '../helpers/modal-helper';
import TextareaAutosize from 'react-autosize-textarea';

const { ModalStore, types } = ModalHelper;

const minRows = 2;
const magicNumber = 41; // This number is the final textarea height after "reset" -> set button height

const ChatBoxStyled = styled.section`
    width: 30vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 2px;
    padding-bottom: 50px;
    position: relative;
    overflow-y: scroll;

    #Scroll-Chat {
        display: flex;
        flex: 0 1 90%;
        flex-direction: column;
        width: 90%;
        transform: translateX(-5px);
    }
`
const ChatTextStyled = styled.section`
    background-color: #999;
    position: absolute;
    bottom: 0;
    width: 100%;

    display: flex;
    align-items: center;

    box-shadow: -5px 0px 5px rgba(0, 0, 0, 0.3);

    textarea {
        box-sizing: border-box;
        width: 100%;
        resize: none;
        border: none;
        box-shadow: none;
        padding: 7px;
    }

    button {
        min-width: 50px;
        box-sizing: border-box;
        min-height: 30px;
        padding: 5px 0px;
        width: 50px;
        max-width: 50px;
        border: none;
        background-color: #216EE9;
        color: #FFF;
        height: 100%;
        outline: none;
    }
`

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            text: "",
            history: Array.from(new Array(50).keys()).map(it => {
                const speaker = it % 2 === 0 ? "me" : "robot";
                if (speaker === "robot") {
                    return ({
                        speaker: speaker,
                        text: `Hello ${it}`,
                        data: {
                            "somedata": "lol"
                        }
                    })
                }
                return ({
                    speaker: speaker,
                    text: `Hello ${it}`,
                })
            })
        }
    }

    componentDidMount() {
        this.setState({
            height: document.getElementById("Chat-TextArea").offsetHeight
        }, () => {
            const elem = document.getElementById("Scroll-Chat");
            elem.parentElement.scrollTop = elem.scrollHeight;
        })
    }

    onAddText = (str) => {
        this.setState({
            history: this.state.history.concat([{
                speaker: "me",
                text: str
            }])
        }, () => {
            const elem = document.getElementById("Scroll-Chat");
            elem.parentElement.scrollTop = elem.scrollHeight;
        })
    }

    render() {
        return (
            <section style={{ display: 'flex', justifyContent: 'center', position: 'relative'}}>
                <ChatBoxStyled>
                    <section id="Scroll-Chat">
                        {
                            this.state.history.map((it, idx) => (
                                <Bubble
                                    key={`b-${idx}`}
                                    speaker={it.speaker}
                                    text={it.text}
                                    onClick={() => { it.speaker === "robot" && ModalStore.dispatch({ type: types.TOGGLE }); }}
                                />
                            ))
                        }
                        <br />
                        <br />
                        <br />
                    </section>
                </ChatBoxStyled>
                <ChatTextStyled>
                    <TextareaAutosize
                        rows={minRows}
                        style={{
                            maxHeight: 50,
                            boxSizing: 'border-box'
                        }}
                        id="Chat-TextArea"
                        innerRef={me => this._textArea = me}
                        value={this.state.text}
                        onChange={(e) => {
                            if (e.target.value.indexOf("\n") !== -1) {
                                if (e.target.value.length > 1) {
                                    this.onAddText(e.target.value);
                                }
                                e.target.value = "";
                                this.setState({
                                    height: magicNumber,
                                    text: e.target.value
                                })
                            } else {
                                this.setState({
                                    height: e.target.clientHeight,
                                    text: e.target.value
                                })
                            }
                        }}
                    />
                    <button
                        style={{
                            height: this.state.height
                        }}
                    >Send</button>
                </ChatTextStyled>
            </section>
        );
    }
}


//<button>Send</button>

export default ChatBox;