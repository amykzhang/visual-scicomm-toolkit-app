import styled from "styled-components";

export const UILayer = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    z-index: 300;
    pointer-events: none;
`;

export const SquareButton = styled.button`
    pointer-events: all;
    background: white;
    border: none;
    border-radius: 5px;
    width: 55px;
    height: 55px;
    background: white;
    padding: 2px;

    &:hover {
        padding: 0;
        border: 2px solid #bbbbbb;
    }

    &[data-isactive="true"] {
        background-color: #d7e9ff;
    }
`;
