import React from 'react';
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
                <img src="https://via.placeholder.com/350x350" />
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
    flex-flow: row wrap; 

    .col {
        display: flex;
        &.grow {
            flex-grow: 1;
        }

        .list {
            width: 400px;
            max-width: 400px;
            min-width: 400px;
            height: 100%;
            background-color: #888;
        }
    
        .info {
            width: 100%;
            height: 100%;
            background-color: #777;
            flex-grow : 1;
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

const ListDescription = (props) => {
    return (
        <ListDescriptionStyled>
            <div className="col">
                <section className="list">
                    <article>
                        ABC
                    </article>
                    <article>
                        ABC
                    </article>
                    <article>
                        ABC
                    </article>
                </section>
            </div>
            <div className="col grow">
                <section className="info">
                    Hello
                </section>
            </div>
        </ListDescriptionStyled>
    );
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