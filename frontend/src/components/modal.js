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
        margin-bottom: 50px;
        /* height: 100%; */
        .modal-content {
            box-sizing: border-box;
            position: relative;
            padding: 40px 10px 10px 10px;

            width: 100%;
            /* height: 100%; */
        }
    }
`

const Toggle = () => ModalStore.dispatch({ type: types.CLOSE })

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
                        { Array.from(new Array(50).keys()).map((it) => <span key={it}>test {it}<br /></span>)}
                    </article>
                </OutsideClickHandler>
            </ModalStyled>
    )
}

export default Modal;