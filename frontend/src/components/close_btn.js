import styled from 'styled-components';

const CrossBar = styled.div`
    width: 32px;
    height: 32px;
    opacity: 0.3;

    &:hover {
        opacity: 1;
    }

    &::before, &::after {
        position: absolute;
        left: 15px;
        content: ' ';
        height: 33px;
        width: 2px;
        background-color: #333;
    }

    &::before {
        transform: rotate(45deg);
    }

    &::after {
        transform: rotate(-45deg);
    }
`

export default CrossBar;