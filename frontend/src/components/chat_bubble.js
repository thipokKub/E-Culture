import React from 'react';
import styled from 'styled-components';

const colorTemplate = {
    "robot": "#158BBF",
    "me": "#4DB9DC",
    "clickable": "#5ECCE9"
}

const BubbleStyled = styled.article`
    box-sizing: border-box;
    background-color: ${ props => props.bgColor};
    position: relative;
    width: calc(100% - 20px);
    ${props => {
        if (props.direction === "left") return `transform: translateX(20px);
        border-radius: 0px 5px 5px 5px;`
        return `border-radius: 5px 0px 5px 5px;`;
        // return "transform: translateX(-20px);"
    }}
    padding: 10px;
    margin: 10px 0px;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);

    &:hover {
        ${props => props.clickable && "box-shadow: 4px 3px 7px rgba(0, 0, 0, 0.3);"}
    }

    &:active {
        ${props => props.clickable && "box-shadow: none;"}
    }

    &::before {
        content: "";
        display: "block";
        box-sizing: border-box;
        ${ props => {
            if(props.direction === "left") {
                return `
                    border: 8px solid ${props.bgColor};
                    border-left: 8px solid transparent;
                    border-bottom: 8px solid transparent; 
                    transform: translateX(-90%);
                    left: 0px;
                `;
            }
            return `
                border: 8px solid ${props.bgColor};
                border-right: 8px solid transparent;
                border-bottom: 8px solid transparent; 
                transform: translateX(90%);
                right: 0px;
            `
        }}
        
        height: 0px;
        width: 0px;
        position: absolute;
        top: 0px;
        /* background-color: ${ props => props.bgColor}; */
    }
`;

const Bubble = ({ speaker, text, clickable, ...props}) => {
    speaker = clickable ? "clickable" : speaker;
    return (
        <BubbleStyled
            direction={speaker === "me" ? "left" : "right"}
            bgColor={colorTemplate[speaker]}
            clickable={clickable}
            {...props}
        >
            {text.split("\n").map((it, idx) => (
                <span key={idx}>{it}<br /></span>
            ))}
        </BubbleStyled>
    );
}

export default Bubble;