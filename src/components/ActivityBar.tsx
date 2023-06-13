import styled from "styled-components";
import { Activity } from "../activity/activity";
import typography from "../styles/typography";

interface ActivityBarProps {
    activity: Activity;
}

const ActivityBarContainer = styled.div`
    position: absolute;
    top: 5rem;
    left: 0px;
    height: calc(90vh - 5rem);
    width: 15rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    gap: 8px;
    background-color: grey;
    flex-direction: column;
    overflow-y: clip;
`;

export const ActivityBar: React.FC<ActivityBarProps> = ({ activity }) => {
    const instructions = activity.instructions;

    return (
        <ActivityBarContainer>
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
        </ActivityBarContainer>
    );
};
