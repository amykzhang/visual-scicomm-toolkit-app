import styled from "styled-components";
import typography from "../styles/typography";
import color from "../styles/color";
import { ReactComponent as ToolkitLogo } from "../assets/ToolkitLogo.svg";

const TitlePanelContainer = styled.div`
    pointer-events: all;
    user-select: none;
    position: absolute;
    height: 69px;
    left: 0px;
    top: 0px;

    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 5px 0px;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 40px 0px 20px;
    gap: 24px;
`;

const Logo = styled(ToolkitLogo)`
    width: 40px;
    height: 40px;
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
            <Logo />
            <StyledName>
                <typography.LargeText>{name}</typography.LargeText>
            </StyledName>
        </TitlePanelContainer>
    );
};
