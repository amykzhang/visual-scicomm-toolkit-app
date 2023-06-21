import styled from "styled-components";

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
    top: 12vh;
    height: 76vh;
    display: flex;
    transition-duration: .5s;
    transition-property: transform;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15));
`

export const SideBarToggle = styled.div`
    pointer-events: all;
    width: 33px;
    height: 92px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const SideBarContent = styled.div`
    width: 20vw;
    height: 100%;
    background: white;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    gap: 8px;
    flex-direction: column;
    overflow-y: hidden;
`