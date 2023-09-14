import { useState } from "react";
import styled from "styled-components";
import { ReactComponent as GearIcon } from "../assets/gear.svg";
import { InformationTool } from "../components/InformationTool";
import { ReactComponent as UploadIcon } from "../assets/upload.svg";
import { Activity } from "../activity/activity";
import typography from "../styles/typography";
import { ExportOptions } from "../utils/interfaces";
import color from "../styles/color";

const ExportPanelContainer = styled.div`
    pointer-events: all;
    user-select: none;
    position: absolute;
    width: 380px;
    height: 69px;
    right: 0px;
    top: 0px;

    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 5px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    gap: 24px;
`;

const ExportButton = styled.div`
    cursor: pointer;
    display: flex;
    width: 230px;
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
    exportManager: ExportOptions;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
    activity,
    exportManager,
}) => {
    const [isExportOptionsOpen, setIsExportOptionsOpen] = useState(false);

    function toggleExportOptions() {
        setIsExportOptionsOpen(!isExportOptionsOpen);
    }

    return (
        <ExportPanelContainer>
            <InformationTool content={activity.info} />
            <GearIcon />
            <ExportButton
                data-isactive={isExportOptionsOpen}
                onClick={toggleExportOptions}
            >
                <UploadIcon />
                <ExportText>Share Canvas</ExportText>
            </ExportButton>
            {isExportOptionsOpen && (
                <>
                    <TransparentBackground onClick={toggleExportOptions} />
                    <ExportOptionsContainer>
                        <ExportOption
                            onClick={() => {
                                exportManager.exportPNG();
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>
                                Export as PNG
                            </typography.MediumText>
                        </ExportOption>
                        <ExportOption
                            onClick={() => {
                                exportManager.exportJPEG();
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>
                                Export as JPEG
                            </typography.MediumText>
                        </ExportOption>
                        <ExportOption
                            onClick={() => {
                                exportManager.exportPDF();
                                toggleExportOptions();
                            }}
                        >
                            <typography.MediumText>
                                Export as PDF
                            </typography.MediumText>
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
