import { useState } from "react";
import { ElementProp, SelectionBoundsProp } from "../utils/interfaces";
import Konva from "konva";

export const DragSelectManager = (
    stageRef: React.RefObject<Konva.Stage>,
    elements: ElementProp[]
) => {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectionBounds, setSelectionBounds] = useState<SelectionBoundsProp>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [elementsWithinBounds, setElementsWithinBounds] = useState<string[]>([]);

    function handleDragSelectMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            setIsSelectionMode(true);
            const pointerPosition = stage.getPointerPosition();
            if (pointerPosition !== null) {
                const x = (pointerPosition.x - stage.x()) / stage.scaleX();
                const y = (pointerPosition.y - stage.y()) / stage.scaleX();
                setSelectionBounds({
                    x,
                    y,
                    width: 0,
                    height: 0,
                });
            }
        }
    }

    function handleDragSelectMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const pointerPosition = stage.getPointerPosition();
            if (pointerPosition !== null) {
                const x = (pointerPosition.x - stage.x()) / stage.scaleX();
                const y = (pointerPosition.y - stage.y()) / stage.scaleX();
                const width = x - selectionBounds.x;
                const height = y - selectionBounds.y;

                setSelectionBounds({
                    ...selectionBounds,
                    width,
                    height,
                });
            }
        }
    }

    function handleDragSelectMouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
        setElementsWithinBounds(getElementsWithinBounds());
        setIsSelectionMode(false);
    }

    function getElementsWithinBounds() {
        const actualBounds = {
            x:
                selectionBounds.width > 0
                    ? selectionBounds.x
                    : selectionBounds.x + selectionBounds.width,
            y:
                selectionBounds.height > 0
                    ? selectionBounds.y
                    : selectionBounds.y + selectionBounds.height,
            width: Math.abs(selectionBounds.width),
            height: Math.abs(selectionBounds.height),
        };

        const filteredElementIds = elements
            .filter((element) => {
                // return (
                //     element.x > actualBounds.x &&
                //     element.y > actualBounds.y &&
                //     element.x + element.width < actualBounds.x + actualBounds.width &&
                //     element.y + element.height < actualBounds.y + actualBounds.height
                // );

                const A = {
                    x0: element.x,
                    y0: element.y,
                    x1: element.x + element.width,
                    y1: element.y + element.height,
                };
                const B = {
                    x0: actualBounds.x,
                    y0: actualBounds.y,
                    x1: actualBounds.x + actualBounds.width,
                    y1: actualBounds.y + actualBounds.height,
                };
                const aLeftOfB = A.x1 < B.x0;
                const aRightOfB = A.x0 > B.x1;
                const aAboveB = A.y0 > B.y1;
                const aBelowB = A.y1 < B.y0;

                return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
            })
            .map((element) => element.id);

        return filteredElementIds;
    }

    return {
        isSelectionMode,
        selectionBounds,
        elementsWithinBounds,
        setElementsWithinBounds,
        getElementsWithinBounds,
        handleDragSelectMouseDown,
        handleDragSelectMouseMove,
        handleDragSelectMouseUp,
    };
};
