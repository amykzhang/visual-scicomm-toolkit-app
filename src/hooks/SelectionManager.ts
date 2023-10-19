import { useCallback } from "react";
import { ElementProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";

export const SelectionManager = (
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    // view: APP_VIEW,
    // setView: (view: APP_VIEW) => void,
    shiftKey: boolean,
    groupSelection: string[],
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>
) => {
    // Selection mode: true when dragging selection rectangle
    // const toggleSelectedId = (id: string) => {
    //     if (groupSelection.includes(id)) {
    //         setGroupSelection(groupSelection.filter((selectedId) => selectedId !== id));
    //     } else {
    //         setGroupSelection([...groupSelection, id]);
    //     }
    // };

    const selectElement = (id: string) => {
        if (shiftKey) {
            setGroupSelection((groupSelection) => {
                if (groupSelection.includes(id)) {
                    return groupSelection.filter((elementId) => elementId !== id);
                } else {
                    return [...groupSelection, id];
                }
            });
        } else {
            setGroupSelection([id]);
        }
    };

    // const handleDragStart = (id: string) => () => {
    //     // if (!groupSelection.includes(id)) setGroupSelection([id]);
    // };

    const deleteSelected = useCallback(() => {
        setElements((elements) =>
            elements.filter((element) => !groupSelection.includes(element.id))
        );
        setGroupSelection([]);
    }, [setElements, groupSelection, setGroupSelection]);

    return {
        selectElement,
        // handleDragStart,
        deleteSelected,
    };
};
