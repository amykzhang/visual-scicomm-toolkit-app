import Konva from "konva";

export const DrawViewManager = () => {
    const addFreehandLine = () => {};

    const handleAddFreehandLine = () => {};

    const handleDrawMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse down");
    };

    const handleDrawMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse move");
    };

    const handleDrawMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse up");
    };

    return {
        handleDrawMouseDown,
        handleDrawMouseMove,
        handleDrawMouseUp,
    };
};
