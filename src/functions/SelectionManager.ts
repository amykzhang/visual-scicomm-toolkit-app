import { useCallback } from "react";
import { ImageProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import Konva from "konva";

export const SelectionManager = (
    images: ImageProp[],
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>,
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

    // Updates the images with offset position and makes a new selection
    const updateResetGroup = () => {
        if (groupRef.current !== null) {
            const group = groupRef.current;

            const newImages = images.map((image) => {
                if (selectionRef.current.includes(image.id)) {
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
        const newImages = images.filter((image) => !selectionRef.current.includes(image.id));
        setImages(newImages);
        selectionRef.current = [];
    }, [images, setImages, selectionRef]);

    return {
        handleSelect,
        deleteSelected,
        updateResetGroup,
    };
};
