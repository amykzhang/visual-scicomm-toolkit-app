import { useCallback, useState } from "react";
import { ImageProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import Konva from "konva";


export const SelectionManager = (
    images: ImageProp[],
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>,
    view: APP_VIEW,
    shiftKey: boolean,
    groupRef: React.MutableRefObject<Konva.Group | null>
) => {
    // selected Ids
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

    return {
        selectedIds,
        setSelectedIds,
        addSelectedId,
        removeSelectedId,
        toggleSelectedId,
        handleSelect,
        deleteSelected,
        updateResetGroup,
    };
}