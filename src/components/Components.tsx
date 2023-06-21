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

    &:hover {
        background-color: #D7E9FF;
    }

    &[data-isactive="true"] {
        background-color: #D7E9FF;
    }
`;
