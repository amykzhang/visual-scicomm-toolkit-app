import { APP_VIEW } from "../utils/enums";
import Konva from "konva";
import { v4 as uuid } from "uuid";
import { ElementProp, TextProp, editTextProp } from "../utils/interfaces";
import { useEffect, useState } from "react";
import constants from "../utils/constants";

export const TextViewManager = (
    view: APP_VIEW,
    setView: (view: APP_VIEW) => void,
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    stageRef: React.RefObject<Konva.Stage>,
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>
) => {
    const [canAddText, setCanAddText] = useState<boolean>(true);
    const [isEditingText, setIsEditingText] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);

    function toggleTextMode() {
        if (view === APP_VIEW.text) setView(APP_VIEW.select);
        else setView(APP_VIEW.text);
    }

    function addTextBox(x: number, y: number) {
        const id = uuid();
        setElements((elements) => [
            ...elements,
            {
                id: id,
                type: "text",
                x: x,
                y: y,
                ...constants.textbox.initialTextBox,
            } as TextProp,
        ]);
        return id;
    }

    // handle stage click in text mode
    // 1) check for click on any are not a 'text'
    // 2) if canAddText is true, just blurred off a textarea, do nothing
    // 3) if canAddText is false, add a textbox
    function handleTextClick(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.target.getAttrs().type === "text") {
            setEditId(e.target.id());
            setCanAddText(false);
        } else {
            if (canAddText) {
                if (stageRef.current !== null && e.target.getAttrs().type !== "text") {
                    const stage = stageRef.current;
                    const x = (e.evt.clientX - stage.x()) / stage.scaleX();
                    const y = (e.evt.clientY - stage.y()) / stage.scaleX();
                    const id = addTextBox(x, y);

                    setEditId(id);
                    setCanAddText(false);
                }
            } else {
                setCanAddText(true);
            }
        }
    }

    // Similar to CommentViewManager.editComment()
    // Hides konva element, creates a textarea, and updates konva elements on blur
    const editText: editTextProp = (text, handleChange, textRef, transformerRef) => {
        if (
            textRef.current !== null &&
            transformerRef.current !== null &&
            stageRef.current !== null
        ) {
            setIsEditingText(true);
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

            const scale = stage.scaleX() * text.scaleX;
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
            textarea.style.textDecoration = textNode.textDecoration();
            textarea.style.fontStyle = textNode.fontStyle();
            textarea.style.transformOrigin = "left top";
            textarea.style.textAlign = textNode.align();
            textarea.style.color = textNode.fill();
            textarea.style.background = "transparent";
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

            width = Math.max(textarea.scrollWidth + 1 * scale, constants.textbox.minWidth * scale);
            height = Math.max(textarea.scrollHeight, constants.textbox.minHeight * scale);
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
                setGroupSelection([]);
                setIsEditingText(false);
                const newText = textarea.value;

                if (newText === "") {
                    setElements((elements) => elements.filter((element) => element.id !== text.id));
                } else {
                    textNode.setAttrs({
                        width: width / scale,
                        height: height / scale,
                    });
                    handleChange(text.id, {
                        text: newText,
                        width: textNode.width(),
                        height: textNode.height(),
                        scaleX: textNode.scaleX(),
                    });
                }

                removeTextarea();
            };

            const handleWheel = (e: WheelEvent) => {
                textarea.blur();
            };

            const handleResize = () => {
                textarea.style.width = "0";
                textarea.style.height = "0";

                width = Math.max(
                    textarea.scrollWidth + 1 * scale,
                    constants.textbox.minWidth * scale
                );
                height = Math.max(textarea.scrollHeight, constants.textbox.minHeight * scale);

                textarea.style.width = width + "px";
                textarea.style.height = height + "px";
            };

            const handleKeyPress = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    textarea.blur();
                    setView(APP_VIEW.select);
                }
            };

            textarea.addEventListener("keydown", handleKeyPress);
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
        isEditingText,
        editTextId: editId,
        setEditId,
    };
};
