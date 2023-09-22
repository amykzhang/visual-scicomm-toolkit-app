import React, { Fragment, useEffect, useState } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";
import { CommentProp } from "../utils/interfaces";
import Konva from "konva";
import color from "../styles/color";

interface CommentElementProp {
    comment: CommentProp;
    comments: CommentProp[];
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>;
    draggable: boolean;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

const CommentElement = ({
    comment,
    comments,
    setComments,
    draggable,
    stageRef,
}: CommentElementProp) => {
    const [showTransform, setShowTransform] = useState(true);

    const textRef = React.useRef<Konva.Text | null>(null);
    const groupRef = React.useRef<Konva.Group | null>(null);
    const transformerRef = React.useRef<Konva.Transformer | null>(null);
    const rectRef = React.useRef<Konva.Rect | null>(null);

    // Constants
    const padding = 15;
    const backgroundColor = color.yellow;

    function handleDblClick() {
        if (
            textRef.current !== null &&
            transformerRef.current !== null &&
            stageRef.current !== null &&
            rectRef.current !== null
        ) {
            const textNode = textRef.current;
            const rectNode = rectRef.current;
            const tr = transformerRef.current;
            const stage = stageRef.current;

            // hide text node and transformer:
            textNode.hide();
            tr.hide();

            // create textarea over canvas with absolute position
            // first we need to find position for textarea
            // how to find it?

            // at first lets find position of text node relative to the stage:
            const textPosition = textNode.absolutePosition();

            // so position of textarea will be the sum of positions above:
            const areaPosition = {
                x: stage.container().offsetLeft + textPosition.x,
                y: stage.container().offsetTop + textPosition.y,
            };

            // create textarea and style it
            const textarea = document.createElement("textarea");
            document.body.appendChild(textarea);

            // apply many styles to match text on canvas as close as possible
            // remember that text rendering on canvas and on the textarea can be different
            // and sometimes it is hard to make it 100% the same. But we will try...
            textarea.value = textNode.text();
            textarea.style.position = "absolute";
            textarea.style.top = areaPosition.y - 2 + "px";
            textarea.style.left = areaPosition.x + "px";
            textarea.style.width = textNode.width() * stage.scaleX() + "px";
            textarea.style.height = textNode.height() * stage.scaleX() + 5 + "px";
            textarea.style.fontSize = textNode.fontSize() * stage.scaleX() + "px";
            textarea.style.border = "none";
            textarea.style.padding = textNode.padding() * stage.scaleX() + "px";
            textarea.style.margin = "0px";
            textarea.style.overflow = "hidden";
            textarea.style.background = "none";
            textarea.style.outline = "none";
            textarea.style.resize = "none";
            textarea.style.lineHeight = textNode.lineHeight() * 20 * stage.scaleX() + "px";
            textarea.style.fontFamily = textNode.fontFamily();
            textarea.style.transformOrigin = "left top";
            textarea.style.textAlign = textNode.align();
            textarea.style.color = textNode.fill();
            let transform = "";

            textarea.style.backgroundColor = "red"; //
            textarea.style.opacity = "0.5"; //

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
            textarea.style.height = "auto";
            // after browsers resized it we can set actual value
            textarea.style.height = textarea.scrollHeight + 3 + "px";

            // Resize rect
            rectRef.current?.setAttrs({
                height: textarea.scrollHeight / stage.scaleX(),
            });

            textarea.focus();

            const setTextareaWidth = (newWidth: number) => {
                //     if (!newWidth) {
                //         // set width for placeholder
                //         newWidth = textNode.placeholder.length * textNode.fontSize();
                //     }
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
                    textarea.parentNode.removeChild(textarea);

                    textarea.removeEventListener("click", handleBlur);
                    window.removeEventListener("wheel", handleWheel);

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
                rectRef.current?.setAttrs({
                    // width: textarea.scrollWidth,
                    height: textarea.scrollHeight / scale,
                });
            });

            const handleBlur = (e: FocusEvent) => {
                textNode.text(textarea.value);
                textNode.setAttrs({
                    width: textarea.scrollWidth / stage.scaleX(),
                    height: textarea.scrollHeight / stage.scaleX(),
                });
                removeTextarea();
                // window.resizeTo(window.screen.availWidth / 2, window.screen.availHeight / 2);
            };

            const handleWheel = (e: WheelEvent) => {
                textarea.blur();
            };

            textarea.addEventListener("blur", handleBlur);
            window.addEventListener("wheel", handleWheel);
        }
    }

    function handleTransform() {
        // reset scale, so only width is changing by transformer
        if (textRef.current !== null && rectRef.current !== null) {
            const text = textRef.current;
            const rect = rectRef.current;
            text.setAttrs({
                width: text.width() * text.scaleX(),
                height: text.height() * text.scaleY(),
                scaleX: 1,
                scaleY: 1,
            });
            rect.setAttrs({
                x: text.x(),
                y: text.y(),
                width: text.width(),
                height: text.height(),
                scaleX: 1,
                scaleY: 1,
            });
        }
    }

    useEffect(() => {
        // we need to attach transformer manually
        if (
            transformerRef.current !== null &&
            textRef.current !== null &&
            rectRef.current !== null
        ) {
            const transformer = transformerRef.current;
            transformer.nodes([textRef.current]);
            transformer.getLayer()?.batchDraw();
        }
    }, []);

    return (
        <Fragment>
            <Group ref={groupRef} draggable>
                <Rect
                    ref={rectRef}
                    x={comment.x}
                    y={comment.y}
                    width={comment.width}
                    height={comment.height}
                    fill={backgroundColor}
                    cornerRadius={[5, 5, 5, 0]}
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
                    padding={padding}
                    onTransform={handleTransform}
                    onDblClick={handleDblClick}
                />
            </Group>
            <Transformer
                ref={transformerRef}
                enabledAnchors={["middle-left", "middle-right", "top-center", "bottom-center"]}
                rotateEnabled={false}
                boundBoxFunc={(oldBox, newBox) => {
                    // limit resize so box can't be negative
                    if (newBox.width < 60 || newBox.height < 60) {
                        return oldBox;
                    }
                    return newBox;
                }}
            />
        </Fragment>
    );
};

export default CommentElement;

// onDragStart={(e) => {}}
// onDragEnd={(e) => {
//     console.log("end");

//     if (groupRef.current !== null) {
//         const group = groupRef.current;

//         const newComments = comments.map((com) => {
//             if (comment.id === com.id) {
//                 return {
//                     ...com,
//                     x: com.x + group.x(),
//                     y: com.y + group.y(),
//                 };
//             } else {
//                 return com;
//             }
//         });
//         setComments(newComments);
//         group.x(0);
//         group.y(0);
//     }
// }}
