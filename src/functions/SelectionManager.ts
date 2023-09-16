import { useCallback, useState } from "react";
import { ImageProp, SelectionBoundsProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import Konva from "konva";

export const SelectionManager = (
    images: ImageProp[],
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>,
    view: APP_VIEW,
    shiftKey: boolean,
    stageRef: React.MutableRefObject<Konva.Stage | null>,
    groupRef: React.MutableRefObject<Konva.Group | null>,
    selectionRectRef: React.MutableRefObject<Konva.Rect | null>
) => {
    // Ids of elements that are group selected
    const [groupSelection, setGroupSelection] = useState<string[]>([]);

    // Selection mode: true when dragging selection rectangle
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectionBounds, setSelectionBounds] = useState<SelectionBoundsProp>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

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
    };

    // Updates the images with offset position and makes a new groupSelection
    const updateResetGroup = () => {
        if (groupRef.current !== null) {
            const group = groupRef.current;

            const newImages = images.map((image) => {
                if (groupSelection.includes(image.id)) {
                    return {
                        ...image,
                        x: image.x + group.x(),
                        y: image.y + group.y(),
                    };
                } else {
                    return image;
                }
            });
            setImages(newImages);
            group.x(0);
            group.y(0);
        }
    };

    const deleteSelected = useCallback(() => {
        const newImages = images.filter((image) => !groupSelection.includes(image.id));
        setImages(newImages);
        setGroupSelection([]);
    }, [images, setImages, groupSelection]);

    // Drag groupSelection

    const handleMouseDown = () => {
        setIsSelectionMode(true);

        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const pointerPosition = stage.getPointerPosition();

            if (pointerPosition !== null) {
                const x = (pointerPosition.x - stage.x()) / stage.scaleX();
                const y = (pointerPosition.y - stage.y()) / stage.scaleX();
                setSelectionBounds({
                    x,
                    y,
                    width: 0,
                    height: 0,
                });
            }
        }
    };

    const handleMouseMove = () => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const pointerPosition = stage.getPointerPosition();

            if (pointerPosition !== null) {
                const x = (pointerPosition.x - stage.x()) / stage.scaleX();
                const y = (pointerPosition.y - stage.y()) / stage.scaleX();
                const width = x - selectionBounds.x;
                const height = y - selectionBounds.y;
                setSelectionBounds({
                    ...selectionBounds,
                    width,
                    height,
                });
            }
        }
    };

    const handleMouseUp = () => {
        setIsSelectionMode(false);

        const targetedIds = getElementIdsWithinBounds();
        // setGroupSelection([...targetedIds]); // why is this not working?
    };

    const getElementIdsWithinBounds = () => {
        const newSelection: string[] = [];

        const actualBounds = {
            x:
                selectionBounds.width > 0
                    ? selectionBounds.x
                    : selectionBounds.x + selectionBounds.width,
            y:
                selectionBounds.height > 0
                    ? selectionBounds.y
                    : selectionBounds.y + selectionBounds.height,
            width: Math.abs(selectionBounds.width),
            height: Math.abs(selectionBounds.height),
        };

        images.forEach((image) => {
            if (
                image.x > actualBounds.x &&
                image.y > actualBounds.y &&
                image.x + image.width < actualBounds.x + actualBounds.width &&
                image.y + image.height < actualBounds.y + actualBounds.height
            ) {
                newSelection.push(image.id);
            }
        });
        return newSelection;
    };

    return {
        groupSelection,
        setGroupSelection,
        isSelectionMode,
        setIsSelectionMode,
        selectionBounds,
        setSelectionBounds,
        handleSelect,
        deleteSelected,
        updateResetGroup,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
};
