import Konva from "konva";
import { APP_VIEW } from "../utils/enums";
import { ElementProp, LineProp } from "../utils/interfaces";
import { v4 as uuid } from "uuid";
import color from "../styles/color";

export const DrawViewManager = (
    view: APP_VIEW,
    setView: (view: APP_VIEW) => void,
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    stageRef: React.RefObject<Konva.Stage>
) => {
    // Add line element to elements
    const addLine = (x: number, y: number, points: number[]) => {
        const id = uuid();
        setElements((elements) => [
            ...elements,
            {
                id: id,
                type: "line",
                x: x,
                y: y,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                points: points,
                tension: 0.05,
                stroke: color.black,
                strokeWidth: 2,
            } as LineProp,
        ]);
        return id;
    };

    const removeLine = (
        id: string,
        setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>
    ) => setElements((elements) => elements.filter((element) => element.id !== id));

    const handleDrawMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse down");
    };

    const handleDrawMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse move");
    };

    const handleDrawMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse up");

        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const x = (e.evt.clientX - stage.x()) / stage.scaleX();
            const y = (e.evt.clientY - stage.y()) / stage.scaleX();
            const points = normalizeLine([0, 0, 100, 0, 100, 100, 200, 0, 200, 200]);
            addLine(x, y, points);
        }
    };

    const toggleDrawMode = () => {
        if (view === APP_VIEW.draw) setView(APP_VIEW.select);
        else setView(APP_VIEW.draw);
    };

    return {
        handleDrawMouseDown,
        handleDrawMouseMove,
        handleDrawMouseUp,
        toggleDrawMode,
    };
};

function normalizeLine(points: number[]) {
    const offsetX = points[0];
    const offsetY = points[1];
    const newPoints = points.map((point, index) => {
        if (index % 2 === 0) return point - offsetX;
        else return point - offsetY;
    });
    return newPoints;
}
