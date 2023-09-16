import Konva from "konva";

// let initialXY = { x: 0, y: 0 };

export const handleDragStart = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>,
    selection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>,
    updateResetGroup: () => void
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        const id = e.target.id();
        console.log("handleDragStart", id);

        // initialXY.x = e.target.x();
        // initialXY.y = e.target.y();
        // const newElements = elements.map((element) => {
        //     return { ...element, isDragging: element.id === id };
        // });
        // setElements(newElements);
        // setSelection([]);
        // updateResetGroup();
    };
};

export const handleDragEnd = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>,
    selection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>,
    updateResetGroup: () => void
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        const id = e.target.id();

        // const offset = {
        //     x: e.target.x() - initialXY.x,
        //     y: e.target.y() - initialXY.y,
        // };

        setElements(
            elements.map((element) => {
                if (element.id === id) {
                    return {
                        ...element,
                        x: e.target.x(),
                        y: e.target.y(),
                        // x: element.x + offset.x,
                        // y: element.y + offset.y,
                        // isDragging: false,
                    };
                } else {
                    return element;
                }
            })
        );
    };
};
