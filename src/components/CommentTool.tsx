import { SquareButton } from "./Components";
import { styled } from "styled-components";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";
import typography from "../styles/typography";
import { useState } from "react";
import commentview from "../functions/CommentView";

const hideButtonWidth = 230;

const HideCommentButton = styled.div`
    position: absolute;
    pointer-events: all;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px 6px;

    width: ${hideButtonWidth}px;
    height: 50px;
    top: 85px;
    left: calc(50% - ${hideButtonWidth / 2}px);

    background-color: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    &:hover {
        background-color: #d7e9ff;
    }
`;

export const CommentTool = () => {
    const [isCommentView, setIsCommentView] = useState(false);

    const displayStyle = isCommentView ? {} : { display: "none" };

    function handleCommentToggle() {
        if (!isCommentView) {
            commentview.enterCommentView();
            // app.setSelectedTool("select");
        } else {
            commentview.exitCommentView();
        }
        setIsCommentView(!isCommentView);
    }

    return (
        <div>
            <SquareButton
                data-isactive={isCommentView}
                onClick={handleCommentToggle}
            >
                <CommentIcon />
            </SquareButton>
            <HideCommentButton
                onClick={handleCommentToggle}
                style={displayStyle}
            >
                <typography.LargeText>Exit Comment Mode</typography.LargeText>
            </HideCommentButton>
        </div>
    );
};