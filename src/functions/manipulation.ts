import Konva from "konva";

export const handleDragStart = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        const id = e.target.id();

        const newElements = elements.map((element) => {
            return { ...element, isDragging: element.id === id };
        });

        setElements(newElements);
    };
};

export const handleDragEnd = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<DragEvent>) => {
        const endX = e.target.x();
        const endY = e.target.y();

        const newElements = elements.map((element) => {
            if (element.isDragging) {
                return {
                    ...element,
                    x: endX,
                    y: endY,
                    isDragging: false,
                };
            } else {
                return element;
            }
        });

        setElements(newElements);
    };
};

export const handleRotationStart = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<Event>) => {
        const id = e.target.id();

        const newElements = elements.map((element) => {
            return { ...element, isTransforming: element.id === id };
        });

        setElements(newElements);
    };
};

export const handleRotationEnd = (
    elements: any[],
    setElements: React.Dispatch<React.SetStateAction<any>>
) => {
    return (e: Konva.KonvaEventObject<Event>) => {
        const endRotation = e.target.rotation();

        console.log(endRotation);
        const newElements = elements.map((element) => {
            if (element.isTransforming) {
                return {
                    ...element,
                    rotation: endRotation,
                    isTransforming: false,
                };
            } else {
                return element;
            }
        });

        setElements(newElements);
    };
};
