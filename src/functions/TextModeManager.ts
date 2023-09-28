import { APP_VIEW } from "../utils/enums";
import Konva from "konva";
import { v4 as uuid } from "uuid";
import { ElementProp, TextProp } from "../utils/interfaces";
import { useEffect } from "react";

export const TextModeManager = (
    view: APP_VIEW,
    setView: (view: APP_VIEW) => void,
    elements: ElementProp[],
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    stageRef: React.RefObject<Konva.Stage>
) => {
    function enterTextMode() {
        setView(APP_VIEW.text);
    }

    function exitTextMode() {
        setView(APP_VIEW.select);
    }

    function toggleTextMode() {
        if (view === APP_VIEW.text) exitTextMode();
        else enterTextMode();
    }

    function addTextBox(
        x: number,
        y: number,
        elements: ElementProp[],
        setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>
    ) {
        const id = uuid();
        setElements([
            ...elements,
            {
                id: id,
                type: "text",
                x: x,
                y: y,
                width: 100,
                height: 20,
                rotation: 0,
                text: "hello world",
                fontSize: 20,
                fontFamily: "Arial",
                fontStyle: "normal",
                fill: "#000000",
                align: "left",
                scale: 1,
            } as TextProp,
        ]);
    }

    const handleAddTextBox = (
        elements: ElementProp[],
        setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
        stageRef: React.RefObject<Konva.Stage>
    ) => {
        return (e: Konva.KonvaEventObject<MouseEvent>) => {
            // if clicked anywhere other than a comment
            if (stageRef.current !== null && e.target.getAttrs().type !== "text") {
                const stage = stageRef.current;
                const x = (e.evt.clientX - stage.x()) / stage.scaleX();
                const y = (e.evt.clientY - stage.y()) / stage.scaleX();
                addTextBox(x, y, elements, setElements);
            }
        };
    };

    // when not clicking on a textbox, deselect selected comment or if nothing is selected add new comment
    function handleTextClick(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.target.getAttrs().type !== "text") {
            handleAddTextBox(elements, setElements, stageRef)(e);
        }
    }

    useEffect(() => {
        if (view === APP_VIEW.text) {
            document.body.style.cursor = "crosshair";
        } else {
            document.body.style.cursor = "default";
        }
    }, [view]);

    return {
        toggleTextMode,
        handleTextClick,
    };
};
