import { useState } from "react";
import { Stage, Layer, Circle } from "react-konva";
import styled from "styled-components";
import { StageViewManager } from "./functions";
import { CommentViewManager } from "./functions";
import { STAGE_VIEW } from "./utils/enums";
import { ElementsPanel } from "./Panels/ElementsPanel";
import { ToolbarPanel } from "./Panels/ToolbarPanel";
import { ActivityPanel } from "./Panels/ActivityPanel";
import { ZoomPanel } from "./Panels/ZoomPanel";
import { TitlePanel } from "./Panels/TitlePanel";
import { BottomZone, TopZone } from "./styles/containers";
import typography from "./styles/typography";
import { ExportArea } from "./components/ExportArea";
import { ExitCommentViewButton } from "./components/Components";
import activity_visual_strategies from "./activity/activity";
import { CommentViewProp } from "./utils/interfaces";

const activity = activity_visual_strategies;

const AppContainer = styled.div``;

const PanelsContainer = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    z-index: 300;
    pointer-events: none;
`;

const _props = { perfectDrawEnabled: false };

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: (0.2 + Math.random() * 0.6) * window.innerWidth,
        y: (0.2 + Math.random() * 0.6) * window.innerHeight,
        rotation: 0,
        isDragging: false,
    }));
}

const initial_state = generateShapes();

export default function App() {
    // for example
    const [shapes, setShapes] = useState(initial_state);

    const handleDragStart = (e: any) => {
        const id = e.target?.id();
        setShapes(
            shapes.map((shape) => {
                return {
                    ...shape,
                    isDragging: shape.id === id,
                };
            })
        );
    };

    const handleDragEnd = () => {
        setShapes(
            shapes.map((shape) => {
                return {
                    ...shape,
                    isDragging: false,
                };
            })
        );
    };

    // Stage View
    const {
        view,
        setView,
        stageRef,
        zoomStage,
        handleTouchMove,
        handleTouchEnd,
    } = StageViewManager();

    // Comment View
    const commentView = CommentViewManager(setView);

    return (
        <AppContainer>
            <PanelsContainer>
                <TopZone>
                    <TitlePanel {...activity} />
                    <ToolbarPanel
                        view={view}
                        setView={setView}
                        commentView={commentView}
                    />
                    <ExitCommentView commentView={commentView} />
                </TopZone>
                <ActivityPanel activity={activity} />
                <ElementsPanel activity={activity} />
                <BottomZone>
                    <ZoomPanel />
                </BottomZone>
            </PanelsContainer>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                // draggable={isPanning}
                draggable={true}
                // onWheel={zoomStage}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                ref={stageRef}
                fill={commentView.state.backgroundColor}
            >
                <Layer>
                    <ExportArea {...activity.canvas_size} />
                    {shapes.map((shape) => (
                        <Circle
                            key={shape.id}
                            id={shape.id}
                            x={shape.x}
                            y={shape.y}
                            radius={25}
                            fill="#050505"
                            opacity={0.8}
                            draggable={view === STAGE_VIEW.select}
                            scaleX={shape.isDragging ? 1.05 : 1}
                            scaleY={shape.isDragging ? 1.05 : 1}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            {..._props}
                        />
                    ))}
                </Layer>
            </Stage>
        </AppContainer>
    );
}

interface ExitCommentStateProps {
    commentView: CommentViewProp;
}

const ExitCommentView: React.FC<ExitCommentStateProps> = ({ commentView }) => {
    const displayStyle = commentView.state.active ? {} : { display: "none" };

    return (
        <ExitCommentViewButton style={displayStyle} onClick={commentView.exit}>
            <typography.LargeText>Exit Comment Mode</typography.LargeText>
        </ExitCommentViewButton>
    );
};
