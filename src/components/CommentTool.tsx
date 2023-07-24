import { STAGE_VIEW } from "../utils/enums";
import { CommentViewProp } from "../utils/interfaces";
import { SquareButton } from "./Components";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";

interface CommentToolProp {
    view: STAGE_VIEW;
    setView: React.Dispatch<React.SetStateAction<STAGE_VIEW>>;
    commentView: CommentViewProp;
}

export const CommentTool: React.FC<CommentToolProp> = ({
    view,
    setView,
    commentView,
}) => {
    const isCommentView = view === STAGE_VIEW.comment;

    function handleToggle() {
        if (isCommentView) {
            commentView.exit();
        } else {
            commentView.enter();
        }
    }

    return (
        <div>
            <SquareButton
                data-isactive={commentView.state.active}
                onClick={handleToggle}
            >
                <CommentIcon />
            </SquareButton>
        </div>
    );
};
