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
    groupRef: React.MutableRefObject<Konva.Group | null>
) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectionBounds, setSelectionBounds] = useState<SelectionBoundsProp>({ x: 0, y: 0, width: 0, height: 0 });

    const addSelectedId = (id: string) => {
        setSelectedIds([...selectedIds, id]);
    };

    const removeSelectedId = (id: string) => {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    };

    const toggleSelectedId = (id: string) => {
        if (selectedIds.includes(id)) {
            removeSelectedId(id);
        } else {
            addSelectedId(id);
        }
    };

    const handleSelect = (id: string) => {
        if (view === APP_VIEW.select) {
            if (shiftKey) {
                toggleSelectedId(id);
            } else {
                if (selectedIds.length === 1 && selectedIds.includes(id)) {
                    setSelectedIds([]);
                } else {
                    setSelectedIds([id]);
                }
            }
            updateResetGroup();
        }
    };

    // Updates the images with offset position and makes a new selection
    const updateResetGroup = () => {
        if (groupRef.current !== null) {
            const group = groupRef.current;

            const newImages = images.map((image) => {
                if (selectedIds.includes(image.id)) {
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
        const newImages = images.filter(
            (image) => !selectedIds.includes(image.id)
        );
        setImages(newImages);
        setSelectedIds([]);
    }, [images,setImages, selectedIds]);


    // Drag selection

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
    };

    return {
        selectedIds,
        setSelectedIds,
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
}