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
    view,
    setView,
    exitCommentView,
    enterCommentView,
    commentViewState,
}) => {
    const isCommentView = view === APP_VIEW.comment;

    function handleToggle() {
        if (isCommentView) {
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
