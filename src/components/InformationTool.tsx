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
                    <DarkenBackground onClick={toggleInformationPopup} />
                    <InformationPopup>
                        <InformationHeader>
                            <StyledCrossIcon onClick={toggleInformationPopup} />
                        </InformationHeader>
                        <InformationContent
                            dangerouslySetInnerHTML={{
                                __html: content,
                            }}
                        ></InformationContent>
                    </InformationPopup>
                </>
            )}
        </>
    );
};

const DarkenBackground = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 400;
`;

const InformationPopup = styled.div`
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

const InformationHeader = styled.div`
    position: relative;
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const InformationContent = styled.div`
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
