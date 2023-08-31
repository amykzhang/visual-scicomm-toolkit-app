import styled from "styled-components";
import { ReactComponent as GearIcon } from "../assets/gear.svg";
import { InformationTool } from "../components/InformationTool";
import { ReactComponent as UploadIcon } from "../assets/upload.svg";
import { Activity } from "../activity/activity";
import typography from "../styles/typography";
import { ExportManager } from "../functions";

const ExportPanelContainer = styled.div`
    position: absolute;
    width: 380px;
    height: 69px;
    right: 0px;
    top: 0px;

    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 5px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    gap: 24px;

    pointer-events: all;
`;

const ExportButton = styled.div`
    display: flex;

    padding: 10px 24px;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    border-radius: 5px;
    background: #629ffc;
`;

const ExportText = styled(typography.LargeText)`
    color: white;
`;

interface ExportPanelProps {
    activity: Activity;
    exportCanvas: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
    activity,
    exportCanvas,
}) => {
    return (
        <ExportPanelContainer>
            <InformationTool content={activity.info} />
            <GearIcon />
            <ExportButton onClick={exportCanvas}>
                <UploadIcon />
                <ExportText>Share Canvas</ExportText>
            </ExportButton>
        </ExportPanelContainer>
    );
};
