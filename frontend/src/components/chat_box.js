import React, { Component } from 'react';
import Bubble from './chat_bubble';
import styled from 'styled-components';
import ModalHelper from '../helpers/modal-helper';
import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';

const { ModalStore, types, ModalTypes } = ModalHelper;
const TARGET_URL = `http://172.20.10.2:5000/api`

const minRows = 2;
const magicNumber = 50; // This number is the final textarea height after "reset" -> set button height

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

const decodeHTML = function (html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const ChatBoxStyled = styled.section`
    width: 30vw;
    height: calc(100vh - 60px);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 2px;
    padding-bottom: 50px;
    position: relative;
    z-index: 990;
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
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    box-shadow: -5px 0px 5px rgba(0, 0, 0, 0.3);
    z-index: 991;
    textarea {
        box-sizing: border-box;
        width: 100%;
        resize: none;
        border: none;
        box-shadow: none;
        padding: 7px;
    }
    button {
        font-size: 1rem;
        min-width: 50px;
        box-sizing: border-box;
        min-height: 30px;
        padding: 5px 0px;
        width: 50px;
        max-width: 50px;
        border: none;
        background-color: #10759E;
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            text: "",
            history: [{
                speaker: "robot",
                text: `สวัสดีค่ะ ฉันชื่อ Blue Map ยินดีที่ได้รู้จักค่าาาา
                ฉันเป็นบ๊อทที่สามารถสอบถามข้อมูลเกี่ยวกับสถานที่ landmark ต่างๆ ภายในประเทศไทยได้
                ก็ขอฝากเนื้อฝากตัวด้วยนะคะ`,
            }],
            state: "none"
        }
    }

    delayedFunc = async (callback, timeout) => {
        try {
            return await new Promise((res) => {
                setTimeout(() => {
                    callback();
                    res(true)
                }, timeout)
            })
        } catch(e) {
            console.error(e);
        }
    }

    componentDidMount() {
        this.setState({
            height: document.getElementById("Chat-TextArea").offsetHeight
        }, () => {
            const elem = document.getElementById("Scroll-Chat");
            elem.parentElement.scrollTop = elem.scrollHeight;
        })
        
        const _this = this;

        (async () => {
            try {
                await _this.delayedFunc(() => _this.onAddText(`ขอโทษนะคะ ลืมบอกอะไรนิดนึง`, "robot", false), 2000);
                await _this.delayedFunc(() => _this.onResponseHelp(), 2000);
            } catch (e) {
                console.error(e);
            }
        })();
    }

    onRemapped = (arr) => {
        return arr.map((it) => ({
            ...it,
            description: decodeHTML(decodeURIComponent(it.description)).replace(/(<([^>]+)>)/ig, ''),
            lat: Math.round(10000 * Number(it.lat)) / 10000,
            lon: Math.round(10000 * Number(it.lon)) / 10000
        }))
    }

    onDetectIntention = async (str) => {
        // Assume we detect intention
        try {
            if (this.state.state === 'search'){
                this.onAddText("ขอเวลานิกนึงนะคะ", "robot")
                return axios.post(`${TARGET_URL}/search`,{text:str}).then((res)=>{
                    let search_list = res.data
                    this.setState({ state: 'none' }, () => {
                        ModalStore.dispatch({
                            type: types.SET,
                            payload: {
                                type: ModalTypes.LIST,
                                data: this.onRemapped(search_list)
                            }
                        });
                        const Text = `ได้ตามนี้นะคะ
                                    ${search_list.map((it, idx) => `${idx + 1}. ${it.title} ที่ จ.${it.province}
                                    `).join("")}`;
    
                        this.onAddText(Text, "robot", true, this.onRemapped(search_list))
                    }) 
                })
            }

            if(this.state.state === "asking") {
                this.setState({
                    state: "none"
                })
                this.onAddText("รอสักครู่ค่ะ", "robot")

                try {
                    const resp = this.onRemapped((await axios.post(`${TARGET_URL}/getDescription`, {
                        title: str
                    })).data)
                    if(resp.length > 0) {
                        ModalStore.dispatch({
                            type: types.SET,
                            payload: {
                                type: ModalTypes.LIST,
                                data: resp
                            }
                        });
    
                        const Text = `น่าจะอันนี้ใช่ไหมคะ?
                                    ${resp.map((it) => `${it.title} ที่ จ.${it.province}`).join("")}`;
                        return this.onAddText(Text, "robot", true, resp)
                    } else {
                        return this.onAddText(`ขอโทษค่ะ ไม่ฉันหาไม่เจอเลย
                        กรุณาตรวจสอบว่าท่านเขียนชื่อถูกต้อง แล้วถามใหม่อีกครั้งนะคะ`, "robot", true, resp)
                    }
                } catch (e) {
                    console.error(e);
                    throw Error("Something Wrong")
                }
            }

            const resp = (await axios.post(`${TARGET_URL}/getIntention`, {
                "text": str
            })).data

            const intention = resp.intent;
            // this.onAddText(`Detected intention: ${intention}`, "robot");
            if(intention === "others") {
                const randomOthers = [`ขอโทษค่ะ พอดีช่วงนี้นอนหน่อย
                    เลยไม่ค่อยเข้าใจ ลองเปลี่ยนคำนะคะ`, `คือยังไงเหรอคะ ขออีกรอบค่ะ`, `แปลว่าอะไรเหรอคะ?`]
                return this.onAddText(randomOthers[getRandomInt(0, randomOthers.length)], "robot")
            } else if(intention === "greeting") {
                const randomGreeting = [`สวัสดีค่ะ มีอะไรจะสอบถามอะไรรึเปล่าคะ?`,
                    `สวีดัส สวัสดีค่ะ มีอะไรให้ช่วยรึเปล่าคะ?`, `สวัสดีค่ะ สบายดีใช่ไหมคะ ตอนนี้อยากทราบอะไรรึเปล่าคะ?`]
                return this.onAddText(randomGreeting[getRandomInt(0, randomGreeting.length)], "robot")
            } else if (intention === "functionality") {
                if(getRandomInt(0, 10) < 1) {
                    return this.onResponseHelp();
                }
                return this.onResponseHelp(resp.text);
            } else if (intention === "asking") {
                // Ketyword matching -> More description
                this.setState({
                    state: "asking"
                })
                return this.onAddText("ใส่ชื่อได้เลยค่ะ", "robot")
            } else if (intention === "search"){
                this.setState({state : 'search'})
                return this.onAddText("อยากจะรู้อะไรหรอคะ", "robot")
            } else if (intention === "recommend") {
                try {
                    this.onAddText("รอแปปนะคะ", "robot")
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            const myLocation = this.props.pointPos && this.props.pointPos.lat !== -1 ? this.props.pointPos : { lat: position.coords.latitude, lon: position.coords.longitude };

                            try {
                                const resp2 = this.onRemapped((await axios.post(`${TARGET_URL}/getRecommend`, myLocation)).data);
                                ModalStore.dispatch({
                                    type: types.SET,
                                    payload: {
                                        type: ModalTypes.LIST,
                                        data: resp2
                                    }
                                });
    
                                const Text = `ได้ตามนี้นะคะ
                                ${resp2.map((it, idx) => `${idx + 1}. ${it.title} ที่ จ.${it.province}
                                `).join("")}`;
    
                                return this.onAddText(Text, "robot", true, resp2)
                            } catch(e) {
                                console.error(e);
                                throw Error("Something Wrong")
                            }
                            
                        });
                    } else {
                        return this.onAddText("ขอโทษค่ะ ตอนนี้ไม่สามารถใส่ตำแหน่งปัจจุบันได้ กรุณาลองใหม่อีกครั้งค่ะ", "robot")
                    }
                } catch (e) {
                    return this.onAddText("ขอโทษค่ะ ตอนนี้ไม่สามารถใส่ตำแหน่งปัจจุบันได้ กรุณาลองใหม่อีกครั้งค่ะ", "robot")
                } 
            }

            // const response = await new Promise((res) => {
            //     setTimeout(() => {
            //         // Assume responses is always an array
            //         const listItem = Array.from(new Array(4).keys()).map((idx) => (
            //             {
            //                 ...exampleObj,
            //                 title: `${exampleObj.title} ${idx}`,
            //                 lat: Math.round(10000 * (exampleObj.lat + 3 * (Math.random() - 0.5))) / 10000,
            //                 lon: Math.round(10000 * (exampleObj.lon + 3 * (Math.random() - 0.5))) / 10000
            //             }
            //         )).concat([{
            //             ...exampleObj,
            //             lat: Math.round(10000 * (exampleObj.lat)) / 10000,
            //             lon: Math.round(10000 * (exampleObj.lon)) / 10000
            //         }])

            //         res({
            //             message: "Lorem ipsum stuff here",
            //             data: listItem
            //         })

            //         ModalStore.dispatch({
            //             type: types.SET,
            //             payload: {
            //                 type: ModalTypes.LIST,
            //                 data: listItem
            //             }
            //         })
            //     }, 500);
            // });
            // this.onAddText(`${response.message}`, "robot", true, response.data)
        } catch (e) {
            console.error(e)
            this.onAddText("ขอโทษค่ะ ตอนนี้ไม่สามารถต่อกับเซิฟเวอร์ได้ กรุณาลองใหม่อีกครั้งภายหลัง", "robot")
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

    onResponseHelp = (head =`ตอนนี้ฉันสามารถสอบถามเกี่ยวกับ`) => {
        this.onAddText(`${head}
        1. แนะนำสถานที่ท่องเที่ยว
        2. ขอเส้นทางคร่าวๆ
        3. ขอรายละเอียดเพิ่มเติมเกี่ยวกับสถานที่ต่างๆ
        ส่วนความสามารถอื่นๆจะตามมาทีหลังนะคะ`, "robot", false);
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
                    backgroundImage: 'linear-gradient(to bottom right, #F1F4FB, #4BB0E7)'
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
                            boxSizing: 'border-box',
                            fontSize: '1rem'
                        }}
                        id="Chat-TextArea"
                        innerRef={me => this._textArea = me}
                        value={this.state.text}
                        onChange={(e) => {
                            if (e.target.value.indexOf("\n") !== -1) {
                                if (e.target.value.length > 1) {
                                    this.onAddText(e.target.value.replace(/\n/gi, ''));
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