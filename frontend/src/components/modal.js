import React, { Component } from 'react';
import styled from 'styled-components';
import ModalHelper from '../helpers/modal-helper';
import OutsideClickHandler from 'react-outside-click-handler';
import CrossBar from './close_btn';
const { ModalStore, types } = ModalHelper;

const ModalStyled = styled.section`
    z-index: 1001;
    width: 80vw;

    > div {
        width: 100%;
        background-color: #FFF;
        border-radius: 5px;
        margin-bottom: 50px;
        /* height: 100%; */
        .modal-content {
            box-sizing: border-box;
            position: relative;
            padding: 10px 10px 10px 10px;
            /* padding: 40px 10px 10px 10px; */

            width: 100%;
            /* height: 100%; */
        }
    }
`;

// const DebugTest = (props) => {
//     return (
//         <section>
//             {Array.from(new Array(50).keys()).map((it) => <span key={it}>test {it}<br /></span>)}
//         </section>
//     );
// }

const FullDescriptionStyled = styled.section`
    display: flex;
    > div {
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`

const FullDescription = (props) => {
    const { title, amphoe, category, description, lat, lon, province, source, tambon, url } = props; 
    return (
        <FullDescriptionStyled>
            <div>
                <h2>{title}</h2>
                <img alt="full-img" src="https://via.placeholder.com/350x350" />
            </div>
            <div>
                <p>{description}</p>
                <p>
                    <div>
                        <b>ตำบล</b>&nbsp;{tambon}&nbsp;
                        <b>อำเภอ</b>&nbsp;{amphoe}&nbsp;
                        <b>จังหวัด</b>&nbsp;{province}&nbsp;
                    </div>
                    <div>
                        <b>Latitude</b>&nbsp;{lat}&nbsp;
                        <b>Longitude</b>&nbsp;{lon}
                    </div>
                </p>
                <p>
                    <b>ประเภท</b>&nbsp;{category}<br />
                    <b>source</b>&nbsp;{source}
                    <b>url</b>&nbsp;{url}
                </p>
            </div>
        </FullDescriptionStyled>
    );
}

const ListDescriptionStyled = styled.section`
    display: flex;
    flex-flow: row; 

    .col {
        display: flex;
        &.grow {
            flex-grow: 1;
        }

        .list {
            width: 300px;
            max-width: 300px;
            min-width: 300px;
            height: 100%;
            max-height: 820px;
            overflow-y: scroll;

            > article {
                box-sizing: border-box;
                border: 1px solid rgba(0, 0, 0, 0.2);
                background-color: #FFF;

                &:hover {
                    filter: brightness(0.9);
                }

                &:active {
                    filter: brightness(0.8);
                }

                &:not(:first-of-type) {
                    border-top: none;
                }

                &.active {
                    border-right: none;
                }
            }
        }
    
        .info {
            padding: 10px;
            width: 100%;
            height: 100%;
            flex-grow : 1;
            border: 1px solid rgba(0, 0, 0, 0.2);
            box-sizing: border-box;
            border-left: none;
        }
    }
    /* > div {
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
    } */
`

class ListDescription extends Component {
    constructor(props) {
        super(props);
        this.state = { index: 0 }
    }

    onClickIdx = (idx) => {
        return () => {
            this.setState({ index: idx })
        }
    }

    render() {
        const listItem = Array.from(new Array(30).keys()).map((idx) => (
            { ...this.props, title: `${this.props.title} ${idx}` }
        ))

        const selectedItem = listItem[this.state.index];

        return (
            <ListDescriptionStyled>
                <div className="col">
                    <section className="list">
                        {
                            listItem.map((it, idx) => {
                                return (
                                    <article key={idx} onClick={this.onClickIdx(idx)} className={idx === this.state.index ? "active" : ""}>
                                        <img alt="thumbnail" src="https://via.placeholder.com/100x100" />
                                        <span>{it.title}</span>
                                    </article>
                                );
                            })
                        }
                    </section>
                </div>
                <div className="col grow">
                    <section className="info">
                        <h2>{selectedItem.title}</h2>
                        <img alt="full-img" src="https://via.placeholder.com/350x350" />
                        <p>{selectedItem.description}</p>
                        <p>
                            <div>
                                <b>ตำบล</b>&nbsp;{selectedItem.tambon}&nbsp;
                                <b>อำเภอ</b>&nbsp;{selectedItem.amphoe}&nbsp;
                                <b>จังหวัด</b>&nbsp;{selectedItem.province}&nbsp;
                            </div>
                            <div>
                                <b>Latitude</b>&nbsp;{selectedItem.lat}&nbsp;
                                <b>Longitude</b>&nbsp;{selectedItem.lon}
                            </div>
                        </p>
                        <p>
                            <b>ประเภท</b>&nbsp;{selectedItem.category}<br />
                            <b>source</b>&nbsp;{selectedItem.source}
                            <b>url</b>&nbsp;{selectedItem.url}
                        </p>
                    </section>
                </div>
            </ListDescriptionStyled>
        );
    }
}

const Toggle = () => ModalStore.dispatch({ type: types.RESETnCLOSE })

const Modal = (props) => {
    return (
            <ModalStyled>
                <OutsideClickHandler
                    onOutsideClick={Toggle}
                >
                    <article className="modal-content">
                        <CrossBar
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px'
                            }}
                            onClick={Toggle}
                        />
                        <ListDescription {...props.data} />
                    </article>
                </OutsideClickHandler>
            </ModalStyled>
    )
}

//<FullDescription {...props.data} />

export default Modal;