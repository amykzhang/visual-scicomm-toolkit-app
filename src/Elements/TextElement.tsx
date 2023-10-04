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
    editText: (
        text: TextProp,
        handleChange: (attributes: any) => void,
        textRef: React.RefObject<Konva.Text>,
        transformerRef: React.RefObject<Konva.Transformer>,
        stageRef: React.RefObject<Konva.Stage>
    ) => void;
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
    editText,
}: TextElementProp) => {
    const isSelected = selectionRef.current.includes(text.id);
    // When the element is dragged selected but not selected yet (to show transformer when dragging and globalflag is disabled)
    const [dragSelected, setDragSelected] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // If transformFlag is disabled from App, no transformer will be shown unless the specific element is drag selected
    // Otherwise, show if it is selected or drag selected
    const showTransform = (transformFlag || dragSelected) && (isSelected || dragSelected);

    const textRef = useRef<Konva.Text>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    // Behaviour: If the element is selected, next click enters edit text mode
    function handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
        if (isSelected) {
            editText(text, handleChange, textRef, transformerRef, stageRef);
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
            const transformedTextAttributes = constants.resizeAnchors.includes(activeAnchor)
                ? {
                      // corner drag = rescaling
                      x: textNode.x(),
                      y: textNode.y(),
                      width: textNode.width(),
                      height: textNode.height(),
                      scale: textNode.scaleX(),
                  }
                : {
                      // otherwise is resizing
                      x: textNode.x(),
                      y: textNode.y(),
                      width: Math.max(5, textNode.width()),
                      height: Math.max(textNode.height()),
                      rotation: textNode.rotation(),
                  };

            handleChange(transformedTextAttributes);
        }
    }

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (isSelected) {
                    editText(text, handleChange, textRef, transformerRef, stageRef);
                    setIsEditing(true);
                }
            }
        },
        [isSelected, editText, setIsEditing, text, handleChange, textRef, transformerRef, stageRef]
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
    //         editText();
    //     }
    // }, [isEditing]);

    return (
        <Fragment>
            <Text
                type="text"
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
