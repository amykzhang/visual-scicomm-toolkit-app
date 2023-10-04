import color from "../styles/color";

const comment = {
    minWidth: 200,
    minHeight: 50,
    background: color.darkerYellow,
    cornerRadius: 20,
    padding: 20,
    initialComment: {
        width: 200,
        height: 50,
        scale: 1,
        text: "",
    },
};

const textbox = {
    initialTextBox: {
        width: 100,
        height: 20,
        rotation: 0,
        text: "",
        fontSize: 20,
        fontFamily: "Arial",
        fontStyle: "normal",
        fill: "#000000",
        align: "left",
        scale: 1,
    },
};

const resizeAnchors = ["top-left", "top-right", "bottom-right", "bottom-left"];

const constants = {
    comment,
    resizeAnchors,
    textbox,
};

export default constants;
