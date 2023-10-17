import { APP_VIEW } from "../utils/enums";
import { Divider, SquareButton } from "../components/Components";
import { CommentTool } from "../components/CommentTool";
import { ReactComponent as SelectIcon } from "../assets/select.svg";
import { ReactComponent as PanIcon } from "../assets/pan.svg";
import { ReactComponent as UndoIcon } from "../assets/undo.svg";
import { ReactComponent as RedoIcon } from "../assets/redo.svg";
import styled from "styled-components";
import { CenterBar } from "../styles/containers";
import constants from "../utils/constants";

const ToolbarPanelContainer = styled(CenterBar)`
    top: 0;
    border-radius: 0px 0px 8px 8px;
`;

interface ToolbarPanelProps {
    view: APP_VIEW;
    setView: (view: APP_VIEW) => void;
    handleUndo: () => void;
    handleRedo: () => void;
}

export const ToolbarPanel: React.FC<ToolbarPanelProps> = ({
    view,
    setView,
    handleRedo,
    handleUndo,
}) => {
    return (
        <ToolbarPanelContainer>
            <SquareButton
                data-isactive={view === APP_VIEW.select}
                onClick={() => setView(APP_VIEW.select)}
                {...constants.tooltip}
                data-tooltip-content="Select"
            >
                <SelectIcon />
            </SquareButton>
            <SquareButton
                data-isactive={view === APP_VIEW.pan}
                onClick={() => setView(APP_VIEW.pan)}
                {...constants.tooltip}
                data-tooltip-content="Pan"
            >
                <PanIcon />
            </SquareButton>
            <CommentTool view={view} setView={setView}></CommentTool>
            <Divider />
            <SquareButton
                onClick={handleUndo}
                {...constants.tooltip}
                data-tooltip-content="Undo ⌘Z"
            >
                <UndoIcon />
            </SquareButton>
            <SquareButton
                onClick={handleRedo}
                {...constants.tooltip}
                data-tooltip-content="Redo ⇧⌘Z"
            >
                <RedoIcon />
            </SquareButton>
        </ToolbarPanelContainer>
    );
};
