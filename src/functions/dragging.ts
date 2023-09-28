import Konva from "konva";

export const handleDragStart = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {};
};

export const handleDragEnd = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        const id = e.target.id();

        setElements(
            elements.map((element) => {
                if (element.id === id) {
                    return {
                        ...element,
                        x: e.target.x(),
                        y: e.target.y(),
                    };
                } else {
                    return element;
                }
            })
        );
    };
};
