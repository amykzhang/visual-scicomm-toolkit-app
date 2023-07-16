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
    gap: 8px;
    flex-direction: column;
    border-radius: 0px 0px 5px 0px;
`;

const ActivityToggle = styled(SideBarToggle)`
    border-radius: 0 5px 5px 0;
`;

const ParagraphContainer = styled.div`
    width: 100%;
    padding-bottom: 18px;
`;

const FocusedParagraphContainer = styled.div`
    width: 100%;
    padding: 18px 18px;
`;

const InstructionContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 15px;
    gap: 13px;
`;

const InstructionTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const InstructionBody = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Instructions = (activity: Activity) => {
    const instructions = activity.instructions;
    return (
        <>
            {instructions.map((instruction, index) => (
                <InstructionContainer key={index}>
                    <InstructionTitle>
                        <typography.BoldSmallText>
                            {instruction.step}
                        </typography.BoldSmallText>
                    </InstructionTitle>
                    <InstructionBody>
                        <typography.SmallText>
                            {instruction.body}
                        </typography.SmallText>
                    </InstructionBody>
                </InstructionContainer>
            ))}
        </>
    );
};

export const ActivityBar: React.FC<ActivityBarProps> = ({ activity }) => {
    // For expanding and collapsing the sidebar
    const [isExpanded, setIsExpanded] = useState(true);
    const Arrow = isExpanded ? LeftArrow : RightArrow;
    const toggleDisplay = () => setIsExpanded(!isExpanded);

    return (
        <ActivityBarContainer className={isExpanded ? "" : "slide-left"}>
            <ActivityContentContainer>
                <SideBarHeader>
                    <Notebook />
                    <typography.LargeText>Task</typography.LargeText>
                </SideBarHeader>
                {activity.task.map((paragraph, index) => {
                    const { container, body } = paragraph;
                    if (container === "paragraph")
                        return (
                            <ParagraphContainer key={index}>
                                <typography.MediumText
                                    dangerouslySetInnerHTML={{
                                        __html: body,
                                    }}
                                ></typography.MediumText>
                            </ParagraphContainer>
                        );
                    else if (container === "focused-paragraph")
                        return (
                            <FocusedParagraphContainer key={index}>
                                <typography.BoldMediumText>
                                    {body}
                                </typography.BoldMediumText>
                            </FocusedParagraphContainer>
                        );
                    // else if (container === "foobar") return (
                    //     <div>foobar</div>
                    // )
                })}
                <Top30>
                    <SideBarHeader>
                        <Notebook />
                        <typography.LargeText>
                            Instructions
                        </typography.LargeText>
                    </SideBarHeader>
                    <Instructions {...activity} />
                </Top30>
            </ActivityContentContainer>
            <ActivityToggle onClick={toggleDisplay}>
                <Arrow />
            </ActivityToggle>
        </ActivityBarContainer>
    );
};
