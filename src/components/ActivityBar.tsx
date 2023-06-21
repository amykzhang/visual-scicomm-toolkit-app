import { useState } from "react";
import { Activity } from "../activity/activity";
import { SideBar, SideBarContent, SideBarToggle } from "../styles/containers";
import typography from "../styles/typography";
import styled from "styled-components";
import { ReactComponent as LeftArrow } from '../assets/arrowhead-left.svg';
import { ReactComponent as RightArrow } from '../assets/arrowhead-right.svg';

interface ActivityBarProps {
    activity: Activity;
}

const ActivityBarContainer = styled(SideBar)`
    left: 0;
`;

const ActivityContentContainer = styled(SideBarContent)`
    pointer-events: all;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    gap: 8px;
    flex-direction: column;
    overflow-y: scroll;
    border-radius: 0px 0px 5px 0px;

    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }
`


const ActivityToggle = styled(SideBarToggle)`
    border-radius: 0 5px 5px 0;
`

export const ActivityBar: React.FC<ActivityBarProps> = ({ activity }) => {
    const instructions = activity.instructions;

    // For expanding and collapsing the sidebar
    const [isExpanded, setIsExpanded] = useState(true);
    const Arrow = isExpanded ? LeftArrow : RightArrow;
    const toggleDisplay = () => setIsExpanded(!isExpanded);

    return (
        <ActivityBarContainer className={isExpanded ? "" : "slide-left"}>
            <ActivityContentContainer> 
                <div>
                    <typography.LargeText>Task</typography.LargeText>
                    <typography.MediumText>
                        {activity.task.primary}
                    </typography.MediumText>
                    <typography.SmallMediumText>
                        {activity.task.secondary}
                    </typography.SmallMediumText>
                </div>
                <div>
                    <typography.LargeText>Instructions</typography.LargeText>
                    {instructions.map((instruction, index) => (
                        <div key={index}>
                            <typography.SmallText>
                                {instruction.step}
                            </typography.SmallText>
                            <typography.SmallText>
                                {instruction.body}
                            </typography.SmallText>
                        </div>
                    ))}
                </div>
            </ActivityContentContainer>
            <ActivityToggle onClick={toggleDisplay}><Arrow/></ActivityToggle>
        </ActivityBarContainer>
    );
};
