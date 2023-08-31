import { useState, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as QuestionIcon } from "../assets/questionmarkcircle.svg";
import { ReactComponent as CrossIcon } from "../assets/cross.svg";

export const InformationTool = ({ content }: { content: string }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const toggleInformationPopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <>
            <StyledQuestionIcon onClick={toggleInformationPopup} />
            {isPopupOpen && (
                <>
                    <DarkenBackground onClick={toggleInformationPopup} />
                    <InformationPopup>
                        <InformationHeader>
                            <StyledCrossIcon onClick={toggleInformationPopup} />
                        </InformationHeader>
                        <InformationContent>{content}</InformationContent>
                    </InformationPopup>
                </>
            )}
        </>
    );
};

const StyledQuestionIcon = styled(QuestionIcon)`
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

const InformationPopup = styled.div`
    position: fixed;
    width: 500px;
    height: 300px;
    left: calc(50vw - 250px);
    top: calc(50vh - 150px);

    background-color: #ffffff;
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
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }
`;

const StyledCrossIcon = styled(CrossIcon)`
    cursor: pointer;
`;
