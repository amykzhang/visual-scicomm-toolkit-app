import styled from "styled-components";
import { Activity } from "../activity/activity";
import typography from "../styles/typography";

const TitlePanelContainer = styled.div`
    position: absolute;
    width: 380px;
    height: 69px;
    left: 0px;
    top: 0px;

    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 5px 0px;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 20px;
    gap: 24px;
`;

const Logo = styled.div`
    padding: 9px 8px;
    text-align: center;
    gap: 10px;

    width: 62px;
    height: 38px;

    background: #000000;
    color: #ffffff;
    border-radius: 5px;
`;

const StyledName = styled.div`
    line-height: 25px;
`;

interface TitlePanelProps {
    name: string;
}

export const TitlePanel: React.FC<TitlePanelProps> = ({ name }) => {
    return (
        <TitlePanelContainer>
            <Logo>LOGO</Logo>
            <StyledName>
                <typography.LargeText>{name}</typography.LargeText>
            </StyledName>
        </TitlePanelContainer>
    );
};
