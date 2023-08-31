import styled from "styled-components";
import { ReactComponent as QuestionIcon } from "../assets/questionmarkcircle.svg";
import { ReactComponent as GearIcon } from "../assets/gear.svg";
import { InformationTool } from "../components/InformationTool";
import { Activity } from "../activity/activity";

const ExportPanelContainer = styled.div`
    position: absolute;
    width: 24vw;
    height: 69px;
    right: 0px;
    top: 0px;

    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 5px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 16px;

    pointer-events: all;
`;

interface ExportPanelProps {
    activity: Activity;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ activity }) => {
    return (
        <ExportPanelContainer>
            <InformationTool content={activity.info} />
            <GearIcon />
        </ExportPanelContainer>
    );
};
