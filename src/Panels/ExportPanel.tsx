import styled from "styled-components";
import { ReactComponent as GearIcon } from "../assets/gear.svg";
import { InformationTool } from "../components/InformationTool";
import { ReactComponent as UploadIcon } from "../assets/upload.svg";
import { Activity } from "../activity/activity";
import typography from "../styles/typography";
import { ExportManager } from "../functions";
import Konva from "konva";
import { useState } from "react";

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
    width: 230px;
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
    stageRef: React.RefObject<Konva.Stage | null>;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
    activity,
    stageRef,
}) => {
    const [isExportOptionsOpen, setIsExportOptionsOpen] = useState(false);

    // Export
    const { exportPNG, exportJPEG, exportPDF } = ExportManager(
        stageRef,
        activity
    );

    function toggleExportOptions() {
        setIsExportOptionsOpen(!isExportOptionsOpen);
    }

    return (
        <ExportPanelContainer>
            <InformationTool content={activity.info} />
            <GearIcon />
            <ExportButton onClick={toggleExportOptions}>
                <UploadIcon />
                <ExportText>Share Canvas</ExportText>
            </ExportButton>
            {isExportOptionsOpen && (
                <>
                    <TransparentBackground onClick={toggleExportOptions} />
                    <ExportOptions>
                        <ExportOption
                            onClick={() => {
                                exportPNG();
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>
                                Export as PNG
                            </typography.MediumText>
                        </ExportOption>
                        <ExportOption
                            onClick={() => {
                                exportJPEG();
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>
                                Export as JPEG
                            </typography.MediumText>
                        </ExportOption>
                        <ExportOption
                            onClick={() => {
                                exportPDF();
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>
                                Export as PDF
                            </typography.MediumText>
                        </ExportOption>
                    </ExportOptions>
                </>
            )}
        </ExportPanelContainer>
    );
};

const TransparentBackground = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    background-color: transparent;
    z-index: 400;
`;

const ExportOptions = styled.div`
    position: fixed;
    width: 230px;
    right: 20px;
    top: 80px;

    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 401;
`;

const ExportOption = styled.div`
    padding: 8px 24px;
    cursor: pointer;

    &:hover {
        background: #d7e9ff;
    }
`;
