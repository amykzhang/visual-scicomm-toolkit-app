import { useCallback } from "react";
import { ImageProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import Konva from "konva";

export const SelectionManager = (
    images: ImageProp[],
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>,
    view: APP_VIEW,
    shiftKey: boolean,
    // stageRef: React.MutableRefObject<Konva.Stage | null>,
    groupSelectionRef: React.MutableRefObject<string[]>,
    groupRef: React.MutableRefObject<Konva.Group | null>
    // exportAreaRef: React.MutableRefObject<Konva.Rect | null>
) => {
    // Selection mode: true when dragging selection rectangle
    const toggleSelectedId = (id: string) => {
        if (groupSelectionRef.current.includes(id)) {
            groupSelectionRef.current = groupSelectionRef.current.filter(
                (selectedId) => selectedId !== id
            );
        } else {
            groupSelectionRef.current = [...groupSelectionRef.current, id];
        }
    };

    const handleSelect = (id: string) => {
        if (view === APP_VIEW.select) {
            if (shiftKey) {
                toggleSelectedId(id);
            } else {
                if (
                    groupSelectionRef.current.length === 1 &&
                    groupSelectionRef.current.includes(id)
                ) {
                    groupSelectionRef.current = [];
                } else {
                    groupSelectionRef.current = [id];
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
                if (groupSelectionRef.current.includes(image.id)) {
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
        const newImages = images.filter((image) => !groupSelectionRef.current.includes(image.id));
        setImages(newImages);
        groupSelectionRef.current = [];
    }, [images, setImages, groupSelectionRef]);

    // DRAG SELECTION
    // const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    //     if (view === APP_VIEW.select && stageRef.current !== null) {
    //         const stage = stageRef.current;

    //         // Only start bounding box drag select if user clicks on stage or export area
    //         if (e.target === stage || e.target === exportAreaRef.current) {
    //             console.log("start selection");
    //             setIsSelectionMode(true);

    //             const pointerPosition = stage.getPointerPosition();
    //             if (pointerPosition !== null) {
    //                 const x = (pointerPosition.x - stage.x()) / stage.scaleX();
    //                 const y = (pointerPosition.y - stage.y()) / stage.scaleX();
    //                 setSelectionBounds({
    //                     x,
    //                     y,
    //                     width: 0,
    //                     height: 0,
    //                 });
    //             }
    //         }
    //     }
    // };

    // const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    //     if (isSelectionMode && stageRef.current !== null) {
    //         console.log("mouse move");
    //         const stage = stageRef.current;
    //         const pointerPosition = stage.getPointerPosition();

    //         if (pointerPosition !== null) {
    //             const x = (pointerPosition.x - stage.x()) / stage.scaleX();
    //             const y = (pointerPosition.y - stage.y()) / stage.scaleX();
    //             const width = x - selectionBounds.x;
    //             const height = y - selectionBounds.y;
    //             setSelectionBounds({
    //                 ...selectionBounds,
    //                 width,
    //                 height,
    //             });
    //         }
    //     }
    // };

    // const handleMouseUp = useCallback(
    //     (e: Konva.KonvaEventObject<MouseEvent>) => {
    //         console.log("mouse up");
    //         if (view === APP_VIEW.select) {
    //             setIsSelectionMode(false);
    //             const newSelection = getElementIdsWithinBounds(selectionBounds, images);
    //             setGroupSelection(newSelection);
    //         }
    //     },
    //     [view, selectionBounds, images]
    // );

    // const getElementIdsWithinBounds = (
    //     selectionBounds: SelectionBoundsProp,
    //     images: ImageProp[]
    // ) => {
    //     const actualBounds = {
    //         x:
    //             selectionBounds.width > 0
    //                 ? selectionBounds.x
    //                 : selectionBounds.x + selectionBounds.width,
    //         y:
    //             selectionBounds.height > 0
    //                 ? selectionBounds.y
    //                 : selectionBounds.y + selectionBounds.height,
    //         width: Math.abs(selectionBounds.width),
    //         height: Math.abs(selectionBounds.height),
    //     };

    //     const newSelection = images
    //         .filter(
    //             (image) =>
    //                 image.x > actualBounds.x &&
    //                 image.y > actualBounds.y &&
    //                 image.x + image.width < actualBounds.x + actualBounds.width &&
    //                 image.y + image.height < actualBounds.y + actualBounds.height
    //         )
    //         .map((image) => image.id);

    //     console.log("getElementsWithinBounds", newSelection);
    //     return newSelection;
    // };

    return {
        // groupSelection,
        // setGroupSelection,
        // isSelectionMode,
        // setIsSelectionMode,
        // selectionBounds,
        // setSelectionBounds,
        handleSelect,
        deleteSelected,
        updateResetGroup,
        // handleMouseDown,
        // handleMouseMove,
        // handleMouseUp,
    };
};
