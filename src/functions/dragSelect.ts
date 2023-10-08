import { ElementProp, SelectionBoundsProp } from "../utils/interfaces";

export function getElementsWithinBounds(
    selectionBounds: SelectionBoundsProp,
    elements: ElementProp[]
) {
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

    const newSelection = elements
        .filter(
            (element) =>
                element.x > actualBounds.x &&
                element.y > actualBounds.y &&
                element.x + element.width < actualBounds.x + actualBounds.width &&
                element.y + element.height < actualBounds.y + actualBounds.height
        )
        .map((element) => element.id);
    return newSelection;
}
