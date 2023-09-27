import { useCallback } from "react";
import { ElementProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import Konva from "konva";

export const SelectionManager = (
    elements: ElementProp[],
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    view: APP_VIEW,
    shiftKey: boolean,
    selectionRef: React.MutableRefObject<string[]>,
    groupRef: React.MutableRefObject<Konva.Group | null>
) => {
    // Selection mode: true when dragging selection rectangle
    const toggleSelectedId = (id: string) => {
        if (selectionRef.current.includes(id)) {
            selectionRef.current = selectionRef.current.filter((selectedId) => selectedId !== id);
        } else {
            selectionRef.current = [...selectionRef.current, id];
        }
    };

    const handleSelect = (id: string) => {
        if (view === APP_VIEW.select) {
            if (shiftKey) {
                toggleSelectedId(id);
            } else {
                if (selectionRef.current.length === 1 && selectionRef.current.includes(id)) {
                    selectionRef.current = [];
                } else {
                    selectionRef.current = [id];
                }
            }
            updateResetGroup();
        }
    };

    // Updates the elements with offset position and makes a new selection
    const updateResetGroup = () => {
        if (groupRef.current !== null) {
            const group = groupRef.current;

            const newElements = elements.map((element) => {
                if (selectionRef.current.includes(element.id)) {
                    return {
                        ...element,
                        x: element.x + group.x(),
                        y: element.y + group.y(),
                    };
                } else {
                    return element;
                }
            });
            setElements(newElements);
            group.x(0);
            group.y(0);
        }
    };

    const deleteSelected = useCallback(() => {
        const newImages = elements.filter((element) => !selectionRef.current.includes(element.id));
        setElements(newImages);
        selectionRef.current = [];
    }, [elements, setElements, selectionRef]);

    return {
        handleSelect,
        deleteSelected,
        updateResetGroup,
    };
};
