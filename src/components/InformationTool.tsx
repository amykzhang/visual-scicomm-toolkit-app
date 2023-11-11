import { useState } from "react";
import styled from "styled-components";
import { ReactComponent as QuestionIcon } from "../assets/questionmarkcircle.svg";
import { ReactComponent as CrossIcon } from "../assets/cross.svg";
import color from "../styles/color";
import { SquareButton } from "./Components";
import constants from "../utils/constants";
import { persistance } from "../utils/persistance";

const isNewVisitor = persistance.isNewVisitor();

export const InformationTool = ({ content }: { content: string }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(isNewVisitor);

    const toggleInformationPopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <>
            <SquareButton
                data-isactive={isPopupOpen}
                onClick={toggleInformationPopup}
                {...constants.tooltip}
                data-tooltip-content="Info"
            >
                <QuestionIcon />
            </SquareButton>
            {isPopupOpen && (
                <>
                    <Background onClick={toggleInformationPopup}>
                        <PopupContainer>
                            <CloseContainer>
                                <StyledCrossIcon onClick={toggleInformationPopup} />
                            </CloseContainer>
                            <InformationContent
                                dangerouslySetInnerHTML={{
                                    __html: content,
                                }}
                            ></InformationContent>
                        </PopupContainer>
                    </Background>
                </>
            )}
        </>
    );
};
const Background = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 400;
`;

const PopupContainer = styled.div`
    width: 70vw;
    height: 70vh;
    background-color: ${color.white};
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0 50px 0;
`;

const CloseContainer = styled.div`
    position: fixed;
    right: calc(50% - 35vw + 20px);
    top: calc(50% - 35vh + 20px);
`;

const InformationContent = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 100px 0px 100px;
    overflow: auto;
`;

const StyledCrossIcon = styled(CrossIcon)`
    cursor: pointer;
`;
