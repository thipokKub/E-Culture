import React, { Component } from 'react';
import Bubble from './chat_bubble';
import styled from 'styled-components';
import ModalHelper from '../helpers/modal-helper';
import TextareaAutosize from 'react-autosize-textarea';

const { ModalStore, types, ModalTypes } = ModalHelper;

const minRows = 2;
const magicNumber = 41; // This number is the final textarea height after "reset" -> set button height

const exampleObj = {
    "amphoe": "เถิน",
    "category": "ปราชญ์ชาวบ้าน",
    "description": "๒ ข้อมูลภูมิปัญญา ๒๑ ชื่อข้อมูลภูมิปัญญา ด้านอาหารและโภชนาการน้ำส้มเกลี้ยงแก้วแปรรูปพาสเจอร์ไรซ์ ๒๒ ความรู้ความสามารถ มีความสามารถในการแปรรูปน้ำส้มเกลี้ยงเป็นเครื่องดื่มเพื่อสุขภาพเพื่อจำหน่ายตามสถานที่ต่างๆในอำเภอเถินและต่างจังหวัด ๒๓ วัสดุวัตถุดิบสื่ออุปกรณ์สำหรับการผลิตผลงานของภูมิปัญญาท้องถิ่น ๑ ผลส้มเกลี้ยงซึ่งเป็นผลไม้ประจำถิ่นของอำเภอเถิน จำนวน ๑๐ กก ๒ เครื่องคั้นน้ำส้มเกลี้ยง ๑ เครื่อง ๓ เกลือป่น ๑ ถุงใหญ่ ๔ น้ำตาล ๕ กก ๕ วัสดุสำหรับบรรจุลงแก้วขวดพลาสติก ๒๔ วิธีการถ่ายทอดของภูมิปัญญาท้องถิ่น ใช้การสอนโดยการบรรยายและหัดทำด้วยของจริง ๑ สอนให้รู้จักกับลักษณะและส่วนประกอบของน้ำส้มเกลี้ยง ๒ สอนให้รู้จักกับอุปกรณ์ที่ต้องใช้แต่ละชนิด ๓ สอนให้รู้จักการคั้นน้ำส้มเกลี้ยงที่ถูกสุขอนามัย ๔ ปรุงรสด้วยน้ำตาลและเกลือป่น ๕ บรรจุน้ำส้มเกลี้ยงลงในแก้วแล้วปิดผนึกปากแก้วและประทับตราสินค้า ๒๖ ประโยชน์คุณค่าของภูมิปัญญาและของผลงาน ประโยชน์ของน้ำส้มเกลี้ยงคือมีสารอาหารวิตามินซีและเป็นการถนอมอาหารอย่างหนึ่งเพื่อเก็บไว้กินได้นานขึ้น คุณค่าของภูมิปัญญาคือได้ถ่ายทอดองค์ความรู้ให้เยาวชนหรือประชาชนที่สนใจ",
    "id": "MOC-16119",
    "lat": 17.6116667,
    "lon": 99.2158333,
    "province": "ลำปาง",
    "source": "ศูนย์ข้อมูลกลางทางวัฒนธรรม",
    "tambon": "ล้อมแรด",
    "title": "นางจันทร์ดี      อินทพันธ์  ",
    "url": "http://123.242.145.13/album/16119"
}

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

        &:hover {
            filter: brightness(1.2);
        }

        &:active {
            filter: brightness(0.8);
        }
    }
`

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            text: "",
            history: [{
                speaker: "robot",
                text: "สวัสดีค่ะ บลาๆๆ เป็นข้อความต้อนรับอ่ะ อิๆ",
            }, {
                speaker: "robot",
                text: "ท่านสามารถสอบถาม บลาๆๆ ได้"
            }]
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

    onDetectIntention = async (str) => {
        // Assume we detect intention
        try {
            const intention = await new Promise((res) => {
                setTimeout(() => {
                    res("recommendation")
                }, 200);
            });
            this.onAddText(`Detected intention: ${intention}`, "robot")

            const response = await new Promise((res) => {
                setTimeout(() => {
                    // Assume responses is always an array
                    const listItem = Array.from(new Array(0).keys()).map((idx) => (
                        {
                            ...exampleObj,
                            title: `${exampleObj.title} ${idx}`,
                            lat: Math.round(10000000 * (exampleObj.lat + 3 * (Math.random() - 0.5))) / 10000000,
                            lon: Math.round(10000000 * (exampleObj.lon + 3 * (Math.random() - 0.5))) / 10000000
                        }
                    )).concat([{ ...exampleObj }])

                    res({
                        message: "Lorem ipsum stuff here",
                        data: listItem
                    })

                    ModalStore.dispatch({
                        type: types.SET,
                        payload: {
                            type: ModalTypes.LIST,
                            data: listItem
                        }
                    })
                }, 500);
            });
            this.onAddText(`${response.message}`, "robot", true, response.data)
        } catch (e) {
            this.onAddText("ขอโทษค่ะ ตอนนี้ไม่สามารถต่อกับเซิฟเวอร์ได้ กรุณาลองใไม่อีกครั้ง", "robot")
        }
    }

    onAddText = (str, speaker="me", clickable=false, data = undefined) => {
        if(speaker === "me") {
            this.onDetectIntention(str)
        }
        this.setState({
            history: this.state.history.concat([{
                speaker: speaker,
                text: str,
                clickable: clickable,
                data: data
            }])
        }, () => {
            const elem = document.getElementById("Scroll-Chat");
            elem.parentElement.scrollTop = elem.scrollHeight;
        })
    }

    onMouseClickHandler = (it) => {
        return () => {
            (it.clickable) && ModalStore.dispatch({
                type: types.SETnOPEN,
                payload: {
                    type: ModalTypes.LIST,
                    data: [...it.data]
                }
            });
        }
    }

    onMouseEnterHandler = (it) => {
        return () => {
            (it.clickable) && ModalStore.dispatch({
                type: types.SET,
                payload: {
                    type: ModalTypes.LIST,
                    data: [...it.data]
                }
            });
        }
    }

    render() {
        return (
            <section
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: '#FFFDC8'
                }}
            >
                <ChatBoxStyled>
                    <section id="Scroll-Chat">
                        {
                            this.state.history.map((it, idx) => (
                                <Bubble
                                    key={`b-${idx}`}
                                    speaker={it.speaker}
                                    text={it.text}
                                    onClick={this.onMouseClickHandler(it)}
                                    onMouseEnter={this.onMouseEnterHandler(it)}
                                    clickable={it.clickable}
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
                        onClick={() => {
                            if (this._textArea.value.length > 0) {
                                this.onAddText(this._textArea.value);
                            }
                            this._textArea.value = "";
                            this.setState({
                                height: magicNumber,
                                text: this._textArea.value
                            })
                        }}
                    >Send</button>
                </ChatTextStyled>
            </section>
        );
    }
}


//<button>Send</button>
/*
Array.from(new Array(50).keys()).map(it => {
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
*/


export default ChatBox;