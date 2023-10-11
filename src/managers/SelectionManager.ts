import { useCallback } from "react";
import { ElementProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import Konva from "konva";

export const SelectionManager = (
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    view: APP_VIEW,
    setView_: (view: APP_VIEW) => void,
    shiftKey: boolean,
    groupSelection: string[],
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>,
    groupRef: React.MutableRefObject<Konva.Group | null>
) => {
    // Selection mode: true when dragging selection rectangle
    const toggleSelectedId = (id: string) => {
        if (groupSelection.includes(id)) {
            setGroupSelection(groupSelection.filter((selectedId) => selectedId !== id));
        } else {
            setGroupSelection([...groupSelection, id]);
        }
    };

    const handleSelect = (id: string) => {
        if (view === APP_VIEW.select) {
            if (shiftKey) {
                toggleSelectedId(id);
            } else {
                if (groupSelection.length === 1 && groupSelection.includes(id)) {
                    setGroupSelection([]);
                } else {
                    setGroupSelection([id]);
                }
            }
            updateResetGroup();
        }
        if (view === APP_VIEW.text) {
            setView_(APP_VIEW.select);
            setGroupSelection([id]);
        }
    };

    // Updates the elements with offset position and makes a new selection
    const updateResetGroup = () => {
        if (groupRef.current !== null) {
            const group = groupRef.current;
            setElements((elements) =>
                elements.map((element) => {
                    if (groupSelection.includes(element.id)) {
                        return {
                            ...element,
                            x: element.x + group.x(),
                            y: element.y + group.y(),
                        };
                    } else {
                        return element;
                    }
                })
            );
            group.x(0);
            group.y(0);
        }
    };

    const deleteSelected = useCallback(() => {
        setElements((elements) =>
            elements.filter((element) => !groupSelection.includes(element.id))
        );
        setGroupSelection([]);
    }, [setElements, groupSelection, setGroupSelection]);

    return {
        handleSelect,
        deleteSelected,
        updateResetGroup,
    };
};
