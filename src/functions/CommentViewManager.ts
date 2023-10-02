import { useState } from "react";
import { CommentProp, CommentStateProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import color from "../styles/color";
import Konva from "konva";
import { v4 as uuid } from "uuid";
import constants from "../styles/constants";

const initialCommentProps = {
    width: 200,
    height: 55,
    scale: 1,
    text: "",
};

export const CommentViewManager = (
    setView: (view: APP_VIEW) => void,
    comments: CommentProp[],
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>,
    stageRef: React.RefObject<Konva.Stage>
) => {
    const [commentViewState, setCommentViewState] = useState<CommentStateProp>({
        backgroundColor: color.canvasBackground,
    });
    const [selectedComment, setSelectedComment] = useState<string | null>(null);

    // function enterCommentView() {
    //     setCommentViewState({
    //         active: true,
    //         backgroundColor: color.commentViewBackground,
    //     });

    //     document.body.style.cursor = "crosshair";
    // }

    // function exitCommentView() {
    //     setCommentViewState({
    //         active: false,
    //         backgroundColor: color.canvasBackground,
    //     });

    //     document.body.style.cursor = "default";
    // }

    function addComment(
        x: number,
        y: number,
        comments: CommentProp[],
        setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>
    ) {
        const id = uuid();
        setComments([
            ...comments,
            {
                id: id,
                x: x,
                y: y - initialCommentProps.height,
                ...initialCommentProps,
            },
        ]);
        return id;
    }

    const handleAddComment = (
        comments: CommentProp[],
        setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>,
        stageRef: React.RefObject<Konva.Stage>
    ) => {
        return (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (stageRef.current !== null) {
                const stage = stageRef.current;
                const x = (e.evt.clientX - stage.x()) / stage.scaleX();
                const y = (e.evt.clientY - stage.y()) / stage.scaleX();
                const id = addComment(x, y, comments, setComments);
                setSelectedComment(id);
            }
        };
    };

    // when not clicking on a comment, deselect selected comment or if nothing is selected add new comment
    function handleCommentViewClickOff(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.target.getAttrs().type !== "comment") {
            if (selectedComment !== null) setSelectedComment(null);
            else handleAddComment(comments, setComments, stageRef)(e);
        }
    }

    function editComment(
        textRef: React.RefObject<Konva.Text | null>,
        rectRef: React.RefObject<Konva.Rect | null>,
        transformerRef: React.RefObject<Konva.Transformer | null>,
        comment: CommentProp
    ) {
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
            const cornerRadius = constants.comment.cornerRadius;

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
            textarea.style.background = constants.comment.background;
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
                textarea.removeEventListener("click", handleBlur);
                window.removeEventListener("wheel", handleWheel);
                textarea.remove();

                textNode.show();
                rectNode.show();
                tr.show();
            };

            const handleBlur = (e: FocusEvent) => {
                e.stopPropagation();
                const newText = textarea.value;

                textNode.setAttrs({
                    width: textarea.scrollWidth / scale,
                    height: textarea.scrollHeight / scale,
                });
                rectNode.setAttrs({
                    width: textarea.scrollWidth / scale,
                    height: textarea.scrollHeight / scale,
                });
                removeTextarea();

                if (textRef.current !== null) {
                    const text = textRef.current;
                    const newComments = comments.map((comment_i) => {
                        if (comment.id === comment_i.id) {
                            return {
                                ...comment_i,
                                text: newText,
                                width: text.width(),
                                height: text.height(),
                                scale: text.scaleX(),
                            };
                        } else {
                            return comment_i;
                        }
                    });
                    setComments(newComments);
                }
            };

            const handleWheel = (e: WheelEvent) => {
                textarea.blur();
            };

            textarea.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    textNode.text(textarea.value);
                    textarea.blur();
                }
                setTextareaWidth(textNode.width() * scale);
                textarea.style.height = textarea.scrollHeight + "px";
            });

            textarea.addEventListener("blur", handleBlur);
            window.addEventListener("wheel", handleWheel);
        }
    }

    return {
        commentViewState,
        setCommentViewState,
        selectedComment,
        setSelectedComment,
        handleCommentViewClickOff,
        editComment,
    };
};
