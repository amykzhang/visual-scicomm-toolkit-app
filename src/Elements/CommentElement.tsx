import React, { Fragment, useEffect } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";
import { CommentProp } from "../utils/interfaces";
import Konva from "konva";
import color from "../styles/color";

const resizeAnchors = ["top-left", "top-right", "bottom-right", "bottom-left"];

interface CommentElementProp {
    comment: CommentProp;
    comments: CommentProp[];
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>;
    draggable: boolean;
    selected: boolean;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
    handleSelect: () => void;
}

const CommentElement = ({
    comment,
    comments,
    setComments,
    draggable,
    selected,
    stageRef,
    handleSelect,
}: CommentElementProp) => {
    const textRef = React.useRef<Konva.Text | null>(null);
    const groupRef = React.useRef<Konva.Group | null>(null);
    const transformerRef = React.useRef<Konva.Transformer | null>(null);
    const rectRef = React.useRef<Konva.Rect | null>(null);

    // Constants
    const padding = 20;
    const backgroundColor = color.darkerYellow;
    const cornerRadius = 20;

    function enterEditTextMode() {
        if (
            textRef.current !== null &&
            stageRef.current !== null &&
            rectRef.current !== null &&
            transformerRef.current !== null
        ) {
            const textNode = textRef.current;
            const rectNode = rectRef.current;
            const tr = transformerRef.current;
            const stage = stageRef.current;

            // hide text node and transformer:
            textNode.hide();
            rectNode.hide();
            tr.hide();

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

            const scale = stage.scaleX() * comment.scale;

            // apply many styles to match text on canvas as close as possible
            // remember that text rendering on canvas and on the textarea can be different
            // and sometimes it is hard to make it 100% the same. But we will try...
            textarea.value = textNode.text();
            textarea.style.position = "absolute";
            textarea.style.top = areaPosition.y + "px";
            textarea.style.left = areaPosition.x + "px";
            textarea.style.width = textNode.width() * scale + "px";
            textarea.style.height = textNode.height() * scale + "px";
            textarea.style.fontSize = textNode.fontSize() * scale + "px";
            textarea.style.border = "none";
            textarea.style.padding = textNode.padding() * scale + "px";
            textarea.style.margin = "0";
            textarea.style.overflow = "hidden";
            textarea.style.background = backgroundColor;
            textarea.style.borderRadius = `${cornerRadius * scale}px ${cornerRadius * scale}px ${
                cornerRadius * scale
            }px 0`;
            textarea.style.outline = "none";
            textarea.style.resize = "none";
            textarea.style.lineHeight = textNode.lineHeight() * 20 * scale + "px";
            textarea.style.fontFamily = textNode.fontFamily();
            textarea.style.transformOrigin = "left top";
            textarea.style.textAlign = textNode.align();
            textarea.style.color = textNode.fill();
            textarea.style.zIndex = "600";
            let transform = "";

            let px = 0;
            // also we need to slightly move textarea on firefox
            // because it jumps a bit
            const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (isFirefox) {
                px += 2 + Math.round(textNode.fontSize() / 20);
            }

            transform += "translateY(-" + px + "px)";
            textarea.style.transform = transform;

            // reset height
            // after browsers resized it we can set actual value
            textarea.style.height = textarea.scrollHeight + 3 + "px";
            textarea.focus();

            const setTextareaWidth = (newWidth: number) => {
                // some extra fixes on different browsers
                var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                if (isSafari || isFirefox) {
                    newWidth = Math.ceil(newWidth);
                }
                var isEdge = /Edge/.test(navigator.userAgent);
                if (isEdge) {
                    newWidth += 1;
                }
                textarea.style.width = newWidth + "px";
            };

            const removeTextarea = () => {
                if (textarea.parentNode !== null) {
                    textarea.removeEventListener("click", handleBlur);
                    window.removeEventListener("wheel", handleWheel);

                    textarea.remove();

                    textNode.show();
                    rectNode.show();
                    tr.show();
                    tr.forceUpdate();
                }
            };

            textarea.addEventListener("keydown", (e) => {
                // hide on enter
                // but don't hide on shift + enter
                if (e.key === "Enter" && !e.shiftKey) {
                    textNode.text(textarea.value);
                    textarea.blur();
                }
                // on esc do not set value back to node
                else if (e.key === "Escape") {
                    textarea.blur();
                }

                const scale = textNode.getAbsoluteScale().x;
                setTextareaWidth(textNode.width() * scale);
                textarea.style.height = textarea.scrollHeight + "px";
            });

            const handleBlur = (e: FocusEvent) => {
                updateText(textarea.value);
                textNode.setAttrs({
                    width: textarea.scrollWidth / scale,
                    height: textarea.scrollHeight / scale,
                });
                rectNode.setAttrs({
                    width: textarea.scrollWidth / scale,
                    height: textarea.scrollHeight / scale,
                });
                removeTextarea();
            };

            const handleWheel = (e: WheelEvent) => {
                textarea.blur();
            };

            textarea.addEventListener("blur", handleBlur);
            window.addEventListener("wheel", handleWheel);
        }
    }

    function updateText(newText: string) {
        const text = newText === "" ? "empty comment" : newText;
        const newComments = comments.map((comment_i) => {
            if (comment.id === comment_i.id) {
                return {
                    ...comment_i,
                    text: text,
                };
            } else {
                return comment_i;
            }
        });
        setComments(newComments);
    }

    function handleDblClick(e: Konva.KonvaEventObject<MouseEvent>) {
        enterEditTextMode();
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
            if (resizeAnchors.includes(activeAnchor)) {
                console.log("resize");
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
            const transformedComment = resizeAnchors.includes(activeAnchor)
                ? {
                      // resizing
                      ...comment,
                      x: text.x(),
                      y: text.y(),
                      width: text.width(),
                      height: text.height(),
                      scale: text.scaleX(),
                  }
                : {
                      // box dimensions
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
            selected &&
            transformerRef.current !== null &&
            textRef.current !== null &&
            rectRef.current !== null
        ) {
            const transformer = transformerRef.current;
            transformer.nodes([textRef.current]);
            transformer.getLayer()?.batchDraw();
        }
    }, [selected]);

    // useEffect(() => {
    //     enterEditTextMode();
    // }, []);

    return (
        <Fragment>
            <Group ref={groupRef} draggable onDragEnd={handleDragEnd}>
                <Rect
                    ref={rectRef}
                    x={comment.x}
                    y={comment.y}
                    width={comment.width}
                    height={comment.height}
                    scaleX={comment.scale}
                    scaleY={comment.scale}
                    fill={backgroundColor}
                    shadowEnabled={true}
                    shadowColor="black"
                    shadowBlur={5}
                    shadowOffsetX={2}
                    shadowOffsetY={2}
                    shadowOpacity={0.2}
                    cornerRadius={[cornerRadius, cornerRadius, cornerRadius, 0]}
                />
                <Text
                    type="comment"
                    ref={textRef}
                    text={comment.text}
                    x={comment.x}
                    y={comment.y}
                    fontSize={20}
                    draggable={draggable}
                    width={comment.width}
                    height={comment.height}
                    scaleX={comment.scale}
                    scaleY={comment.scale}
                    padding={padding}
                    onTransform={handleTransform}
                    onTransformEnd={handleTransformEnd}
                    onClick={handleSelect}
                    onDblClick={handleDblClick}
                    on
                />
            </Group>
            {selected && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    borderEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize so box can't be negative
                        if (stageRef.current !== null) {
                            const scale = stageRef.current.scaleX();
                            if (newBox.width < 55 * scale || newBox.height < 55 * scale) {
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
