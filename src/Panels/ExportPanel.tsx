import { useState } from "react";
import styled from "styled-components";
import { InformationTool } from "../components/InformationTool";
import { ReactComponent as UploadIcon } from "../assets/upload.svg";
import { Activity } from "../activity/activity";
import typography from "../styles/typography";
import color from "../styles/color";
import { SettingTool } from "../components/SettingTool";

const ExportPanelContainer = styled.div`
    pointer-events: all;
    user-select: none;
    position: absolute;
    height: 69px;
    right: 0px;
    top: 0px;
    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0px 8px;
`;

const ExportButton = styled.div`
    cursor: pointer;
    display: flex;
    width: 160px;
    padding: 10px 24px;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    border-radius: 5px;
    background: ${color.blue};

    &:hover {
        opacity: 0.9;
    }

    &[data-isactive="true"] {
        opacity: 0.8;
`;

const ExportText = styled(typography.LargeText)`
    color: ${color.white};
`;

interface ExportPanelProps {
    activity: Activity;
    startExportProcess: (type: "png" | "jpeg" | "pdf" | null) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ activity, startExportProcess }) => {
    const [isExportOptionsOpen, setIsExportOptionsOpen] = useState(false);

    function toggleExportOptions() {
        setIsExportOptionsOpen(!isExportOptionsOpen);
    }

    return (
        <ExportPanelContainer>
            <InformationTool content={activity.info} />
            <SettingTool />
            <ExportButton data-isactive={isExportOptionsOpen} onClick={toggleExportOptions}>
                <UploadIcon />
                <ExportText>Export</ExportText>
            </ExportButton>
            {isExportOptionsOpen && (
                <>
                    <TransparentBackground onClick={toggleExportOptions} />
                    <ExportOptionsContainer>
                        <ExportOption
                            onClick={() => {
                                startExportProcess("png");
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>Export as PNG</typography.MediumText>
                        </ExportOption>
                        <ExportOption
                            onClick={() => {
                                startExportProcess("jpeg");
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>Export as JPEG</typography.MediumText>
                        </ExportOption>
                        <ExportOption
                            onClick={() => {
                                startExportProcess("pdf");
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>Export as PDF</typography.MediumText>
                        </ExportOption>
                    </ExportOptionsContainer>
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

const ExportOptionsContainer = styled.div`
    position: fixed;
    width: 230px;
    right: 20px;
    top: 80px;

    background: ${color.white};
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
        background: ${color.lightBlue};
    }
`;
