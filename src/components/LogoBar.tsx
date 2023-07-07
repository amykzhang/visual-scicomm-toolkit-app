import styled from "styled-components";
import { Activity } from "../activity/activity";
import typography from "../styles/typography";

interface LogoBarProps {
    activity: Activity;
}

const LogoBarContainer = styled.div`
    position: absolute;
    width: 24vw;
    height: 69px;
    left: 0px;
    top: 0px;

    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 5px 0px;

    display: flex;
    align-items: center;
    justify-content: center;
`;

const Logo = styled.div`
    padding: 9px 8px;
    text-align: center;
    gap: 10px;

    position: absolute;
    width: 62px;
    height: 38px;
    left: 12px;
    top: 13px;

    background: #000000;
    color: #ffffff;
    border-radius: 5px;
`;

const StyledName = styled.div`
    position: absolute;
    left: 100px;
    line-height: 25px;
`;

export const LogoBar: React.FC<LogoBarProps> = ({ activity }) => {
    return (
        <LogoBarContainer>
            <Logo>hello</Logo>
            <StyledName>
                <typography.LargeText>{activity.name}</typography.LargeText>
            </StyledName>
        </LogoBarContainer>
    );
};
