import color from "../styles/color";

const constants = {
    comment: {
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
    },
    resizeAnchors: ["top-left", "top-right", "bottom-right", "bottom-left"],
    textbox: {
        minWidth: 5,
        minHeight: 20,
        initialTextBox: {
            width: 5,
            height: 20,
            rotation: 0,
            text: "",
            fontSize: 20,
            fontFamily: "Arial",
            fontStyle: "normal",
            fill: "#000000",
            align: "left",
            scaleX: 1,
            scaleY: 1,
        },
    },
    line: {
        tension: 0.4,
        hitStrokeWidth: 50,
    },
    transformer: {
        borderStroke: color.blue,
    },
    tooltip: {
        "data-tooltip-id": "ui-tooltip",
        "data-tooltip-delay-show": 1000,
        // "data-tooltip-float": true,
    },
};

export default constants;
