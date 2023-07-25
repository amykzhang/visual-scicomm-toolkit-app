import { useEffect } from "react";
import { STAGE_VIEW } from "../utils/enums";
import { CommentViewProp } from "../utils/interfaces";
import { CommentViewManager } from "../functions";
import { SquareButton } from "../components/Components";
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
    view: STAGE_VIEW;
    setView: React.Dispatch<React.SetStateAction<STAGE_VIEW>>;
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
                data-isactive={view === STAGE_VIEW.select}
                onClick={() => setView(STAGE_VIEW.select)}
            >
                <SelectIcon />
            </SquareButton>

            <SquareButton
                data-isactive={view === STAGE_VIEW.pan}
                onClick={() => setView(STAGE_VIEW.pan)}
            >
                <PanIcon />
            </SquareButton>

            <CommentTool
                view={view}
                setView={setView}
                commentView={commentView}
            ></CommentTool>

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
