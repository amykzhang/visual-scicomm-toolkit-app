import Konva from "konva";

let initialXY = { x: 0, y: 0 };

export const handleDragStart = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        console.log("drag start");

        const id = e.target.id();
        initialXY.x = e.target.x();
        initialXY.y = e.target.y();

        console.log("id", id);
        const newElements = elements.map((element) => {
            console.log("element.id", element.id);
            return { ...element, isDragging: element.id === id };
        });

        console.log("before", newElements);

        setElements(newElements);
    };
};

export const handleDragEnd = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        console.log("drag end");

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

        console.log("after", newElements);

        setElements(newElements);
    };
};
