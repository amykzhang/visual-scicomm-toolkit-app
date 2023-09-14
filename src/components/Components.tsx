import styled from "styled-components";
import color from "../styles/color";

export const SquareButton = styled.button`
    pointer-events: all;
    background: ${color.white};
    border: none;
    border-radius: 5px;
    width: 55px;
    height: 55px;
    padding: 2px;

    &[data-isactive="true"] {
        background-color: ${color.lightBlue};
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

    background-color: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;

    &:hover {
        background-color: ${color.lightBlue};
    }
`;
