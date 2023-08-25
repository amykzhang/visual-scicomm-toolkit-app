import { useState } from "react";
import { Activity } from "../activity/activity";
import {
    SideBar,
    SideBarHeader,
    SideBarContent,
    SideBarToggle,
    Top30,
    Top20,
    Top10,
} from "../styles/containers";
import typography from "../styles/typography";
import styled from "styled-components";
import { ReactComponent as LeftArrow } from "../assets/arrowhead-left.svg";
import { ReactComponent as RightArrow } from "../assets/arrowhead-right.svg";
import { ReactComponent as Notebook } from "../assets/notebook.svg";

interface ActivityPanelProps {
    activity: Activity;
    isOpen: boolean;
    handleToggle: () => void;
}

const ActivityPanelContainer = styled(SideBar)`
    left: 0;
`;

const ActivityContentContainer = styled(SideBarContent)`
    pointer-events: all;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    flex-direction: column;
    border-radius: 0px 0px 5px 0px;
`;

const ActivityToggle = styled(SideBarToggle)`
    border-radius: 0 5px 5px 0;
`;

const Invisible = styled.div`
    display: none;
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
            <Invisible>
                <Notebook />
            </Invisible>
            <ActivityContentContainer
                dangerouslySetInnerHTML={{
                    __html: activity.activity_panel,
                }}
            ></ActivityContentContainer>
            <ActivityToggle onClick={handleToggle}>
                <Arrow />
            </ActivityToggle>
        </ActivityPanelContainer>
    );
};
