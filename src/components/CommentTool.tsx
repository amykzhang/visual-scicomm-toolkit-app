import { APP_VIEW } from "../utils/enums";
// import { CommentViewProp } from "../utils/interfaces";
import { SquareButton } from "./Components";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";

interface CommentToolProp {
    view: APP_VIEW;
    setView: (view: APP_VIEW) => void;
    exitCommentView: () => void;
    enterCommentView: () => void;
    commentViewState: { active: boolean };
}

export const CommentTool: React.FC<CommentToolProp> = ({
    exitCommentView,
    enterCommentView,
    commentViewState,
}) => {
    function handleToggle() {
        if (commentViewState.active) {
            exitCommentView();
        } else {
            enterCommentView();
        }
    }

    return (
        <div>
            <SquareButton data-isactive={commentViewState.active} onClick={handleToggle}>
                <CommentIcon />
            </SquareButton>
        </div>
    );
};
