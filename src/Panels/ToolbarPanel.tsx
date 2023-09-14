import { APP_VIEW } from "../utils/enums";
import { CommentViewProp } from "../utils/interfaces";
import { Divider, SquareButton } from "../components/Components";
import { CommentTool } from "../components/CommentTool";
import { ReactComponent as SelectIcon } from "../assets/select.svg";
import { ReactComponent as PanIcon } from "../assets/pan.svg";
import { ReactComponent as UndoIcon } from "../assets/undo.svg";
import { ReactComponent as RedoIcon } from "../assets/redo.svg";
import styled from "styled-components";
import { CenterBar } from "../styles/containers";

const ToolbarPanelContainer = styled(CenterBar)`
    top: 0;
    border-radius: 0px 0px 8px 8px;
`;

interface ToolbarPanelProps {
    view: APP_VIEW;
    setView: (view: APP_VIEW) => void;
    commentView: CommentViewProp;
}

export const ToolbarPanel: React.FC<ToolbarPanelProps> = ({
    view,
    setView,
    commentView,
}) => {
    return (
        <ToolbarPanelContainer>
            <SquareButton
                data-isactive={view === APP_VIEW.select}
                onClick={() => setView(APP_VIEW.select)}
            >
                <SelectIcon />
            </SquareButton>
            <SquareButton
                data-isactive={view === APP_VIEW.pan}
                onClick={() => setView(APP_VIEW.pan)}
            >
                <PanIcon />
            </SquareButton>
            <CommentTool
                view={view}
                setView={setView}
                commentView={commentView}
            ></CommentTool>
            <Divider />
            <SquareButton
            // onClick={() => app.undo()}
            >
                <UndoIcon />
            </SquareButton>
            <SquareButton
            // onClick={() => app.redo()}
            >
                <RedoIcon />
            </SquareButton>
        </ToolbarPanelContainer>
    );
};
