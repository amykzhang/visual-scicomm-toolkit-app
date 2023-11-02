import { useEffect, useRef } from "react";
import { Text } from "react-konva";
import { TextProp, editTextProp } from "../utils/interfaces";
import Konva from "konva";
import constants from "../utils/constants";

interface TextElementProp {
    text: TextProp;
    draggable: boolean;
    handleChange: (id: string, attributes: any) => void;
    isSelected: boolean;
    editId: string | null;
    editText: editTextProp;
    transformerRef: React.MutableRefObject<Konva.Transformer | null>;
}

const TextElement = ({
    text,
    draggable,
    handleChange,
    isSelected,
    editId,
    editText,
    transformerRef,
}: TextElementProp) => {
    const textRef = useRef<Konva.Text>(null);

    const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.evt && e.evt.button !== 0) return; // Only handle left click
        if (isSelected) editText(text, handleChange, textRef, transformerRef);
    };

    function handleTransform(e: Konva.KonvaEventObject<Event>) {
        if (textRef.current !== null && transformerRef.current !== null) {
            const textNode = textRef.current;
            const transformerNode = transformerRef.current;
            const activeAnchor = transformerNode.getActiveAnchor();

            // If only transformer this textbox: corners scale proportionally, sides change w/h
            // if transforming this and other elements: do not change at all
            if (isSelected) {
                if (constants.resizeAnchors.includes(activeAnchor)) {
                    transformerNode.keepRatio(true);
                } else {
                    textNode.setAttrs({
                        width: (textNode.width() * textNode.scaleX()) / text.scaleX,
                        height: Math.max(
                            constants.textbox.minHeight,
                            (textNode.height() * textNode.scaleY()) / text.scaleX
                        ),
                        scaleX: text.scaleX,
                        scaleY: text.scaleX,
                    });
                }
            } else {
                textNode.setAttrs({
                    width: text.width,
                    height: text.height,
                    scaleX: text.scaleX,
                    scaleY: text.scaleY,
                });
            }
        }
    }

    function handleTransformEnd() {
        if (textRef.current !== null && transformerRef.current !== null) {
            const textNode = textRef.current;
            const transformerNode = transformerRef.current;

            if (isSelected) {
                transformerNode.keepRatio(false);
            }

            const activeAnchor = transformerNode.getActiveAnchor();
            const transformedTextAttributes = constants.resizeAnchors.includes(activeAnchor)
                ? {
                      // corner drag = rescaling
                      x: textNode.x(),
                      y: textNode.y(),
                      width: textNode.width(),
                      height: textNode.height(),
                      scaleX: textNode.scaleX(),
                  }
                : {
                      // otherwise is resizing
                      x: textNode.x(),
                      y: textNode.y(),
                      width: Math.max(5, textNode.width()),
                      height: Math.max(textNode.height()),
                      rotation: textNode.rotation(),
                  };

            handleChange(text.id, transformedTextAttributes);
        }
    }

    // Enter edit mode when first added
    useEffect(() => {
        if (editId === text.id) {
            editText(text, handleChange, textRef, transformerRef);
        }
        // eslint-disable-next-line
    }, [editId]);

    return (
        <Text
            {...text}
            fontStyle={text.fontStyle.join(" ")}
            textDecoration={text.textDecoration.join(" ")}
            ref={textRef}
            id={text.id}
            draggable={draggable}
            onClick={handleClick}
            onDragEnd={(e) => {
                handleChange(text.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                });
            }}
            onTransform={handleTransform}
            onTransformEnd={handleTransformEnd}
        />
    );
};

export default TextElement;
