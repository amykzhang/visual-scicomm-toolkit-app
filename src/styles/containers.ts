import styled from "styled-components";
import color from "./color";

export const Top10 = styled.div`
    padding-top: 10px;
`;

export const Top20 = styled.div`
    padding-top: 20px;
`;

export const Top30 = styled.div`
    padding-top: 30px;
`;

/**
 * For the Editor
 */

export const TopZone = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
`;

export const BottomZone = styled.div`
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
`;

export const SideBar = styled.div`
    position: absolute;
    top: 14vh;
    height: 76vh;
    display: flex;
    transition-duration: 0.5s;
    transition-property: transform;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15));

    &.slide-left {
        transform: translateX(-340px);
    }

    &.slide-right {
        transform: translateX(340px);
    }
`;

export const SideBarHeader = styled.div`
    user-select: none;

    width: 373px;
    height: 92px;
    background: ${color.white};
    border-radius: 5px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    gap: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const SideBarToggle = styled.div`
    pointer-events: all;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    display: inline-flex;
    padding: 31px 7px;
    align-items: flex-start;
    gap: 10px;
    border-radius: 5px;
    background-color: ${color.white};

    &:hover {
        background: ${color.lightBlue};
    }
`;

export const SideBarContent = styled.div`
    user-select: none;
    pointer-events: all;
    
    width: 340px;
    height: 70vh;
    background: ${color.white};
    padding: 22px;

    overflow-y: scroll;
`;

export const CenterBar = styled.div`
    margin-left: auto;
    margin-right: auto;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px 6px;
    gap: 9px;

    width: 330px;
    height: 70px;

    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;
