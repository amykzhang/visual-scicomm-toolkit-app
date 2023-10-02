import { APP_VIEW } from "../utils/enums";
import { SquareButton } from "./Components";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";

interface CommentToolProp {
    view: APP_VIEW;
    setView: (view: APP_VIEW) => void;
}

export const CommentTool: React.FC<CommentToolProp> = ({ view, setView }) => {
    function handleToggle() {
        if (view === APP_VIEW.comment) {
            setView(APP_VIEW.select);
        } else {
            setView(APP_VIEW.comment);
        }
    }

    return (
        <div>
            <SquareButton data-isactive={view === APP_VIEW.comment} onClick={handleToggle}>
                <CommentIcon />
            </SquareButton>
        </div>
    );
};
