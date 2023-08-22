import { APP_VIEW } from "../utils/enums";
import { CommentViewProp } from "../utils/interfaces";
import { SquareButton } from "./Components";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";

interface CommentToolProp {
    view: APP_VIEW;
    setView: React.Dispatch<React.SetStateAction<APP_VIEW>>;
    commentView: CommentViewProp;
}

export const CommentTool: React.FC<CommentToolProp> = ({
    view,
    setView,
    commentView,
}) => {
    const isCommentView = view === APP_VIEW.comment;

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
