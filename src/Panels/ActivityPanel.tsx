import { Activity } from "../activity/activity";
import {
    SideBar,
    SideBarContent,
    SideBarHeader,
    SideBarToggle,
} from "../styles/containers";
import styled from "styled-components";
import { ReactComponent as LeftArrow } from "../assets/arrowhead-left.svg";
import { ReactComponent as RightArrow } from "../assets/arrowhead-right.svg";
import { ReactComponent as Notebook } from "../assets/notebook.svg";
import typography from "../styles/typography";

interface ActivityPanelProps {
    activity: Activity;
    isOpen: boolean;
    handleToggle: () => void;
}

const ActivityPanelContainer = styled(SideBar)`
    left: 0;
`;

const ActivityContentContainer = styled(SideBarContent)`
    position: fixed;
    top: 80px;
    padding-right: 30px;

    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    flex-direction: column;
    border-radius: 0px 0px 5px 0px;
`;

const ActivityHeader = styled(SideBarHeader)`
    padding: 22px;
`;

const ActivityToggle = styled(SideBarToggle)`
    position: fixed;
    right: 0;
    margin: 6px;
`;

export const ActivityPanel: React.FC<ActivityPanelProps> = ({
    activity,
    isOpen,
    handleToggle,
}) => {
    // For expanding and collapsing the sidebar
    const Arrow = isOpen ? LeftArrow : RightArrow;

    return (
        <ActivityPanelContainer className={isOpen ? "" : "slide-left"}>
            <ActivityHeader>
                <Notebook />
                <typography.LargeText>Task</typography.LargeText>
                <ActivityToggle onClick={handleToggle}>
                    <Arrow />
                </ActivityToggle>
            </ActivityHeader>
            <ActivityContentContainer
                dangerouslySetInnerHTML={{
                    __html: activity.activity_panel,
                }}
            ></ActivityContentContainer>
        </ActivityPanelContainer>
    );
};
