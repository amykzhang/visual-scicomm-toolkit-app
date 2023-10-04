import { APP_VIEW } from "../utils/enums";
import Konva from "konva";
import { v4 as uuid } from "uuid";
import { ElementProp, TextProp } from "../utils/interfaces";
import { useEffect } from "react";

export const TextViewManager = (
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

    // Similar to CommentViewManager.editComment()
    // Hides konva element, creates a textarea, and updates konva elements on blur
    const editText = (
        text: TextProp,
        handleChange: (attributes: any) => void,
        textRef: React.RefObject<Konva.Text>,
        transformerRef: React.RefObject<Konva.Transformer>,
        stageRef: React.RefObject<Konva.Stage>
    ) => {
        if (
            textRef.current !== null &&
            transformerRef.current !== null &&
            stageRef.current !== null
        ) {
            const textNode = textRef.current;
            const transformerNode = transformerRef.current;
            const stage = stageRef.current;

            // hide text node and transformer:
            textNode.hide();
            transformerNode.hide();

            // first find position of text node relative to the stage:
            const textPosition = textNode.absolutePosition();

            // so position of textarea will be the sum of positions above:
            const areaPosition = {
                x: stage.container().offsetLeft + textPosition.x,
                y: stage.container().offsetTop + textPosition.y,
            };

            // create textarea and style it
            const textarea = document.createElement("textarea");
            document.body.appendChild(textarea);

            const scale = stage.scaleX() * text.scale;
            let width: number = 0;
            let height: number = 0;

            // apply many styles to match text on canvas as close as possible
            // remember that text rendering on canvas and on the textarea can be different
            // and sometimes it is hard to make it 100% the same. But we will try...
            textarea.value = textNode.text();
            textarea.style.position = "absolute";
            textarea.style.top = areaPosition.y + "px";
            textarea.style.left = areaPosition.x + "px";
            textarea.style.width = width + "px";
            textarea.style.height = height + "px";
            textarea.style.fontSize = textNode.fontSize() * scale + "px";
            textarea.style.border = "1px solid " + transformerNode.borderStroke();
            textarea.style.padding = "0";
            textarea.style.margin = "-10px -1px";
            textarea.style.overflow = "hidden";
            textarea.style.outline = "none";
            textarea.style.resize = "none";
            textarea.style.lineHeight = textNode.lineHeight() * 20 * scale + "px";
            textarea.style.fontFamily = textNode.fontFamily();
            textarea.style.transformOrigin = "left top";
            textarea.style.textAlign = textNode.align();
            textarea.style.color = textNode.fill();
            textarea.style.zIndex = "100";
            textarea.wrap = "off";

            let px = 0;
            // also we need to slightly move textarea on firefox
            // because it jumps a bit
            const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (isFirefox) {
                px += 2 + Math.round(textNode.fontSize() / 20);
            }

            const transform = "translateY(-" + px + "px)";
            textarea.style.transform = transform;

            width = textarea.scrollWidth + 1 * scale;
            height = textarea.scrollHeight;
            textarea.style.width = width + "px";
            textarea.style.height = height + "px";

            textarea.focus();

            // const setTextareaWidth = (newWidth: number) => {
            //     // some extra fixes on different browsers
            //     var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            //     var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            //     if (isSafari || isFirefox) {
            //         newWidth = Math.ceil(newWidth);
            //     }
            //     var isEdge = /Edge/.test(navigator.userAgent);
            //     if (isEdge) {
            //         newWidth += 1;
            //     }
            //     textarea.style.width = newWidth + "px";

            const removeTextarea = () => {
                textarea.removeEventListener("keypress", handleKeyPress);
                textarea.removeEventListener("click", handleBlur);
                textarea.removeEventListener("input", handleResize);
                window.removeEventListener("wheel", handleWheel);
                textarea.remove();

                textNode.show();
                transformerNode.show();
            };

            const handleBlur = (e: FocusEvent) => {
                e.stopPropagation();
                const newText = textarea.value;

                if (newText === "") {
                    // removeComment(comment.id, comments, setComments);
                    removeTextarea();
                    return;
                }

                textNode.setAttrs({
                    width: width / scale,
                    height: height / scale,
                });
                handleChange({
                    text: newText,
                    width: textNode.width(),
                    height: textNode.height(),
                    scale: textNode.scaleX(),
                });
                removeTextarea();
            };

            const handleWheel = (e: WheelEvent) => {
                textarea.blur();
            };

            const handleResize = () => {
                textarea.style.width = "0";
                textarea.style.height = "0";

                width = textarea.scrollWidth + 1 * scale;
                height = textarea.scrollHeight;

                textarea.style.width = width + "px";
                textarea.style.height = height + "px";
            };

            const handleKeyPress = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    e.preventDefault();
                    textarea.blur();
                }
            };

            textarea.addEventListener("keypress", handleKeyPress);
            textarea.addEventListener("input", handleResize);
            textarea.addEventListener("blur", handleBlur);
            window.addEventListener("wheel", handleWheel);
        }
    };

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
        editText,
    };
};
