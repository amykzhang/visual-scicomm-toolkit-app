import { useState } from "react";
import styled from "styled-components";
import { ReactComponent as GearIcon } from "../assets/gear.svg";
import { ReactComponent as CrossIcon } from "../assets/cross.svg";
import color from "../styles/color";
import { SquareButton } from "./Components";

export const SettingTool = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const toggleSettingPopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <>
            <SquareButton
                data-isactive={isPopupOpen}
                onClick={toggleSettingPopup}
            >
                <GearIcon />
            </SquareButton>
            {isPopupOpen && (
                <>
                    <DarkenBackground onClick={toggleSettingPopup} />
                    <SettingPopup>
                        <SettingHeader>
                            <StyledCrossIcon onClick={toggleSettingPopup} />
                        </SettingHeader>
                        <SettingContent>Settings</SettingContent>
                    </SettingPopup>
                </>
            )}
        </>
    );
};

const StyledQuestionIcon = styled(GearIcon)`
    cursor: pointer;
    z-index: 401;
`;

const DarkenBackground = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 400;
`;

const SettingPopup = styled.div`
    position: fixed;
    width: 70vw;
    height: 50vh;
    left: calc(15vw);
    top: calc(25vh);

    background-color: ${color.white};
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;

    z-index: 401;
`;

const SettingHeader = styled.div`
    position: relative;
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const SettingContent = styled.div`
    user-select: none;
    position: relative;
    width: 100%;
    height: 90%;
    padding: 30px;
    overflow-y: scroll;
`;

const StyledCrossIcon = styled(CrossIcon)`
    cursor: pointer;
`;
