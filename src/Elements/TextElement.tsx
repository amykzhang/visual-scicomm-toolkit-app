import { Fragment, useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { TextProp, editTextProp } from "../utils/interfaces";
import Konva from "konva";
import constants from "../utils/constants";

interface TextElementProp {
    text: TextProp;
    draggable: boolean;
    selectionRef: React.MutableRefObject<string[]>;
    transformFlag: boolean;
    isJustCreated: boolean;
    setTransformFlag: React.Dispatch<React.SetStateAction<boolean>>;
    handleChange: (attributes: any) => void;
    handleSelect: () => void;
    handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    editText: editTextProp;
}

const TextElement = ({
    text,
    draggable,
    selectionRef,
    transformFlag,
    isJustCreated,
    setTransformFlag,
    handleChange,
    handleSelect,
    handleDragEnd,
    editText,
}: TextElementProp) => {
    const isSelected = selectionRef.current.includes(text.id);
    // When the element is dragged selected but not selected yet (to show transformer when dragging and globalflag is disabled)
    const [dragSelected, setDragSelected] = useState(false);

    // If transformFlag is disabled from App, no transformer will be shown unless the specific element is drag selected
    // Otherwise, show if it is selected or drag selected
    const showTransform = (transformFlag || dragSelected) && (isSelected || dragSelected);

    const textRef = useRef<Konva.Text>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    // Behaviour: If the element is selected, next click enters edit text mode
    function handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
        if (isSelected) {
            editText(text, handleChange, textRef, transformerRef);
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

    // Enter edit mode when first added
    useEffect(() => {
        if (isJustCreated) {
            editText(text, handleChange, textRef, transformerRef);
        }
        // eslint-disable-next-line
    }, []);

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
                onDragStart={(e) => {
                    setDragSelected(true);
                    setTransformFlag(false);
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
