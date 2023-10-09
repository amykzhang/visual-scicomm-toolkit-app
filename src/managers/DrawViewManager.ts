import Konva from "konva";
import { APP_VIEW } from "../utils/enums";

export const DrawViewManager = (view: APP_VIEW, setView: (view: APP_VIEW) => void) => {
    const addFreehandLine = () => {};

    const removeFreehandLine = () => {};

    const handleAddFreehandLine = () => {};

    const handleRemoveFreehandLine = () => {};

    const handleDrawMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse down");
    };

    const handleDrawMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse move");
    };

    const handleDrawMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("draw mouse up");
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
