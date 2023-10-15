import { useCallback } from "react";
import { ElementProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";

export const SelectionManager = (
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    view: APP_VIEW,
    setView: (view: APP_VIEW) => void,
    shiftKey: boolean,
    groupSelection: string[],
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>
) => {
    // Selection mode: true when dragging selection rectangle
    const toggleSelectedId = (id: string) => {
        if (groupSelection.includes(id)) {
            setGroupSelection(groupSelection.filter((selectedId) => selectedId !== id));
        } else {
            setGroupSelection([...groupSelection, id]);
        }
    };

    const handleSelect = (id: string) => () => {
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
        }
        if (view === APP_VIEW.text) {
            setView(APP_VIEW.select);
            setGroupSelection([id]);
        }
    };

    const handleDragStart = (id: string) => () => {
        if (!groupSelection.includes(id)) setGroupSelection([id]);
    };

    const deleteSelected = useCallback(() => {
        setElements((elements) =>
            elements.filter((element) => !groupSelection.includes(element.id))
        );
        setGroupSelection([]);
    }, [setElements, groupSelection, setGroupSelection]);

    return {
        handleSelect,
        handleDragStart,
        deleteSelected,
    };
};
