import React, { Fragment, useEffect } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";
import { CommentProp } from "../utils/interfaces";
import Konva from "konva";
import constants from "../utils/constants";
import color from "../styles/color";

interface CommentElementProp {
    comment: CommentProp;
    comments: CommentProp[];
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>;
    draggable: boolean;
    isSelected: boolean;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
    handleSelect: () => void;
    editComment: (
        textRef: React.RefObject<Konva.Text | null>,
        rectRef: React.RefObject<Konva.Rect | null>,
        transformerRef: React.RefObject<Konva.Transformer | null>,
        comment: CommentProp
    ) => void;
}

const CommentElement = ({
    comment,
    comments,
    setComments,
    draggable,
    isSelected,
    stageRef,
    handleSelect,
    editComment,
}: CommentElementProp) => {
    const textRef = React.useRef<Konva.Text | null>(null);
    const groupRef = React.useRef<Konva.Group | null>(null);
    const transformerRef = React.useRef<Konva.Transformer | null>(null);
    const rectRef = React.useRef<Konva.Rect | null>(null);

    // Behaviour: If the element is isSelected, next click enters edit text mode
    function handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
        if (isSelected) {
            editComment(textRef, rectRef, transformerRef, comment);
        } else {
            handleSelect();
        }
    }

    function handleTransform(e: Konva.KonvaEventObject<Event>) {
        // reset scale, so only width is changing by transformer
        if (
            textRef.current !== null &&
            rectRef.current !== null &&
            transformerRef.current !== null
        ) {
            const text = textRef.current;
            const rect = rectRef.current;
            const transformer = transformerRef.current;

            const activeAnchor = transformer.getActiveAnchor();
            if (constants.resizeAnchors.includes(activeAnchor)) {
                rect.setAttrs({
                    x: text.x(),
                    y: text.y(),
                    width: text.width(),
                    height: text.height(),
                    scaleX: text.scaleX(),
                    scaleY: text.scaleY(),
                });
            } else {
                text.setAttrs({
                    width: (text.width() * text.scaleX()) / comment.scale,
                    height: (text.height() * text.scaleY()) / comment.scale,
                    scaleX: comment.scale,
                    scaleY: comment.scale,
                });
                rect.setAttrs({
                    x: text.x(),
                    y: text.y(),
                    width: text.width(),
                    height: text.height(),
                });
            }
        }
    }

    function handleTransformEnd() {
        if (textRef.current !== null && transformerRef.current !== null) {
            const text = textRef.current;
            const transformer = transformerRef.current;
            const activeAnchor = transformer.getActiveAnchor();
            const transformedComment = constants.resizeAnchors.includes(activeAnchor)
                ? {
                      // corner = rescaling
                      ...comment,
                      x: text.x(),
                      y: text.y(),
                      width: text.width(),
                      height: text.height(),
                      scale: text.scaleX(),
                  }
                : {
                      // resizing
                      ...comment,
                      x: text.x(),
                      y: text.y(),
                      width: text.width(),
                      height: text.height(),
                  };

            const newComments = comments.map((comment_i) => {
                if (comment.id === comment_i.id) {
                    return transformedComment;
                } else {
                    return comment_i;
                }
            });
            setComments(newComments);
        }
    }

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (groupRef.current !== null) {
            const group = groupRef.current;

            // Update comment position with group offset
            const newComments = comments.map((comment_i) => {
                if (comment.id === comment_i.id) {
                    return {
                        ...comment_i,
                        x: comment_i.x + group.x(),
                        y: comment_i.y + group.y(),
                    };
                } else {
                    return comment_i;
                }
            });
            setComments(newComments);
            group.x(0);
            group.y(0);
        }
    };

    useEffect(() => {
        // we need to attach transformer manually
        if (
            isSelected &&
            transformerRef.current !== null &&
            textRef.current !== null &&
            rectRef.current !== null
        ) {
            const transformer = transformerRef.current;
            transformer.nodes([textRef.current]);
            transformer.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    // Enter edit Comment mode when first added
    useEffect(() => {
        if (isSelected) {
            editComment(textRef, rectRef, transformerRef, comment);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <Group
                ref={groupRef}
                draggable={draggable}
                onDragEnd={handleDragEnd}
                onMouseEnter={() => {
                    document.body.style.cursor = "default";
                }}
                onMouseLeave={() => {
                    document.body.style.cursor = "crosshair";
                }}
            >
                <Rect
                    ref={rectRef}
                    x={comment.x}
                    y={comment.y}
                    width={comment.width}
                    height={comment.height}
                    scaleX={comment.scale}
                    scaleY={comment.scale}
                    fill={constants.comment.background}
                    shadowEnabled={true}
                    shadowColor={color.black}
                    shadowBlur={5}
                    shadowOffsetX={2}
                    shadowOffsetY={2}
                    shadowOpacity={0.2}
                    cornerRadius={[
                        constants.comment.cornerRadius,
                        constants.comment.cornerRadius,
                        constants.comment.cornerRadius,
                        0,
                    ]}
                />
                <Text
                    type="comment"
                    ref={textRef}
                    text={comment.text}
                    x={comment.x}
                    y={comment.y}
                    fontSize={20}
                    width={comment.width}
                    height={comment.height}
                    scaleX={comment.scale}
                    scaleY={comment.scale}
                    padding={constants.comment.padding}
                    onTransform={handleTransform}
                    onTransformEnd={handleTransformEnd}
                    onClick={handleClick}
                    onTap={handleClick}
                />
            </Group>
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    borderEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize so box can't be negative
                        if (stageRef.current !== null) {
                            const scale = stageRef.current.scaleX();
                            if (
                                newBox.width < constants.comment.totalWidth * scale ||
                                newBox.height < constants.comment.totalHeight * scale
                            ) {
                                return oldBox;
                            }
                            return newBox;
                        }
                        return oldBox;
                    }}
                />
            )}
        </Fragment>
    );
};

export default CommentElement;
