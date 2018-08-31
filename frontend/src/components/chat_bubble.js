import React from 'react';
import styled from 'styled-components';

const colorTemplate = {
    "robot": "#1DAFEC",
    "me": "#9ABF55"
}

const BubbleStyled = styled.article`
    background-color: ${ props => props.bgColor};
    border-radius: 5px;
    position: relative;
    width: calc(100% - 20px);

    &::before {
        content: "";
        display: "block";
        height: 20px;
        width: 10px;
        position: absolute;
        top: 0px;
        left: 0px;
        transform: translateX(-100%);
        background-color: ${ props => props.bgColor};
    }
`;

const Bubble = (props) => {
    return (
        <BubbleStyled
            direction={props.speaker === "me" ? "left" : "right"}
            bgColor={colorTemplate[props.speaker]}
        >
            {props.text}
        </BubbleStyled>
    );
}

export default Bubble;