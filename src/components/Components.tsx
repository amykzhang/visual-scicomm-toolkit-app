import styled from "styled-components";

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

export const ExitCommentViewButton = styled.div`
    position: absolute;
    pointer-events: all;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px 6px;

    width: 230px;
    height: 50px;
    top: 85px;
    left: calc(50% - 115px);

    background-color: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    &:hover {
        background-color: #d7e9ff;
    }
`;
