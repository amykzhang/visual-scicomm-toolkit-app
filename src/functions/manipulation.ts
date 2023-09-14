import Konva from "konva";

let initialXY = { x: 0, y: 0 };

export const handleDragStart = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>,
    selectedIds: string[],
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        const id = e.target.id();
        initialXY.x = e.target.x();
        initialXY.y = e.target.y();

        const newElements = elements.map((element) => {
            return { ...element, isDragging: element.id === id};
        });
        setElements(newElements);
    };
};

export const handleDragEnd = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        const offset = {
            x: e.target.x() - initialXY.x,
            y: e.target.y() - initialXY.y,
        };

        const newElements = elements.map((element) => {
            if (element.isDragging) {
                return {
                    ...element,
                    x: element.x + offset.x,
                    y: element.y + offset.y,
                    isDragging: false,
                };
            } else {
                return element;
            }
        });

        setElements(newElements);
    };
};
