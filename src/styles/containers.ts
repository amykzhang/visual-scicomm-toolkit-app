import styled from "styled-components";

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
    /* background-color: red; */
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
        transform: translateX(-325px);
    }

    &.slide-right {
        transform: translateX(325px);
    }
`;

export const SideBarHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 0px;
    gap: 10px;
    padding-bottom: 20px;
`;

export const SideBarToggle = styled.div`
    pointer-events: all;
    width: 33px;
    height: 92px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const SideBarContent = styled.div`
    width: 325px;
    height: 100%;
    background: white;
    padding: 18px;
    pointer-events: all;

    overflow-y: scroll;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }
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

    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;
