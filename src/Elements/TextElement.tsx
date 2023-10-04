import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { TextProp } from "../utils/interfaces";
import Konva from "konva";
import constants from "../utils/constants";

interface TextElementProp {
    text: TextProp;
    draggable: boolean;
    selectionRef: React.MutableRefObject<string[]>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
    transformFlag: boolean;
    setTransformFlag: React.Dispatch<React.SetStateAction<boolean>>;
    handleChange: (attributes: any) => void;
    handleSelect: () => void;
    handleDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
    handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    updateResetGroup: () => void;
}

const TextElement = ({
    text,
    draggable,
    selectionRef,
    stageRef,
    transformFlag,
    setTransformFlag,
    handleChange,
    handleSelect,
    handleDragStart,
    handleDragEnd,
    updateResetGroup,
}: TextElementProp) => {
    const isSelected = selectionRef.current.includes(text.id);
    // When the element is dragged selected but not selected yet (to show transformer when dragging and globalflag is disabled)
    const [dragSelected, setDragSelected] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // If transformFlag is disabled from App, no transformer will be shown unless the specific element is drag selected
    // Otherwise, show if it is selected or drag selected
    const showTransform = (transformFlag || dragSelected) && (isSelected || dragSelected);

    const textRef = useRef<Konva.Text | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    // Similar to CommentViewManager.editComment()
    // Hides konva element, creates a textarea, and updates konva elements on blur
    const enterEditTextMode = useCallback(() => {
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
    }, [handleChange, stageRef, text.scale]);

    // Behaviour: If the element is selected, next click enters edit text mode
    function handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
        if (isSelected) {
            enterEditTextMode();
            setIsEditing(true);
        } else {
            handleSelect();
        }
    }

    function handleTransform(e: Konva.KonvaEventObject<Event>) {
        // reset scale, so only width is changing by transformer
        if (textRef.current !== null && transformerRef.current !== null) {
            const textNode = textRef.current;
            const transformerNode = transformerRef.current;

            const activeAnchor = transformerNode.getActiveAnchor();
            if (!constants.resizeAnchors.includes(activeAnchor)) {
                textNode.setAttrs({
                    width: (textNode.width() * textNode.scaleX()) / text.scale,
                    height: (textNode.height() * textNode.scaleY()) / text.scale,
                    scaleX: text.scale,
                    scaleY: text.scale,
                });
            }
        }
    }

    function handleTransformEnd() {
        if (textRef.current !== null && transformerRef.current !== null) {
            const textNode = textRef.current;
            const transformerNode = transformerRef.current;

            const activeAnchor = transformerNode.getActiveAnchor();
            const transformedText = constants.resizeAnchors.includes(activeAnchor)
                ? {
                      // corner drag = rescaling
                      ...text,
                      x: textNode.x(),
                      y: textNode.y(),
                      width: textNode.width(),
                      height: textNode.height(),
                      scale: textNode.scaleX(),
                  }
                : {
                      // otherwise is resizing
                      ...text,
                      x: textNode.x(),
                      y: textNode.y(),
                      width: Math.max(5, textNode.width()),
                      height: Math.max(textNode.height()),
                      rotation: textNode.rotation(),
                  };

            handleChange(transformedText);
        }
    }

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (isSelected) {
                    enterEditTextMode();
                    setIsEditing(true);
                }
            }
        },
        [isSelected, enterEditTextMode, setIsEditing]
    );

    useEffect(() => {
        // Show transformer when the text is selected or dragged
        if (showTransform) {
            // we need to attach transformer manually
            if (transformerRef.current !== null && textRef.current !== null) {
                const transformerNode = transformerRef.current;
                transformerNode.nodes([textRef.current]);
                transformerNode.getLayer()?.batchDraw();
            }
        }
    }, [showTransform]);

    // Selected ID key press listeners
    useEffect(() => {
        if (isEditing) {
            window.removeEventListener("keyup", handleKeyPress);
        } else {
            window.addEventListener("keyup", handleKeyPress);
        }

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        };
    }, [handleKeyPress, isEditing]);

    // useEffect(() => {
    //     if (isEditing) {
    //         enterEditTextMode();
    //     }
    // }, [isEditing]);

    return (
        <Fragment>
            <Text
                ref={textRef}
                id={text.id}
                text={text.text}
                x={text.x}
                y={text.y}
                width={text.width}
                height={text.height}
                rotation={text.rotation}
                scaleX={text.scale}
                scaleY={text.scale}
                fontSize={text.fontSize}
                fontFamily={text.fontFamily}
                fontStyle={text.fontStyle}
                fill={text.fill}
                draggable={draggable}
                onClick={handleClick}
                onMouseDown={updateResetGroup}
                onDragStart={(e) => {
                    setDragSelected(true);
                    setTransformFlag(false);
                    handleDragStart(e);
                }}
                onDragEnd={(e) => {
                    handleDragEnd(e);
                    selectionRef.current = [text.id];
                    setTransformFlag(true);
                    setDragSelected(false);
                }}
                onTransform={handleTransform}
                onTransformEnd={handleTransformEnd}
                onContextMenu={(e) => {
                    e.evt.preventDefault();
                }}
            />
            {showTransform && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </Fragment>
    );
};

export default TextElement;
