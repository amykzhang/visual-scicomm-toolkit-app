export type Activity = {
    name: string;
    canvas_size: {
        width: number;
        height: number;
    };
    activity_panel: string; // Rich Text
    elements: {
        text: {
            heading: string;
            text: string[];
            icons: string[];
            srcs: string[];
            sizes: {
                width: number;
                height: number;
            }[];
        };
        draw: {
            heading: string;
            contents: {
                name: string;
                type: string;
                tool: string;
            }[];
        };
        lines: {
            heading: string;
            icons: string[];
            srcs: string[];
            sizes: {
                width: number;
                height: number;
            }[];
        };
        shapes: {
            heading: string;
            shapes: string[];
            fill: boolean[];
            sizes: {
                width: number;
                height: number;
            }[];
        };
        images: {
            heading: string;
            sections: {
                subheading: string;
                icons: string[];
                srcs: string[];
                sizes: {
                    width: number;
                    height: number;
                }[];
            }[];
        };
    };
    info: string;
    color_palette: string[];
};

const activity_visual_strategies: Activity = {
    name: "Visual Strategies",
    canvas_size: {
        width: 850,
        height: 810,
    },
    activity_panel: `
        <div class="medium-text">You're a researcher who wants to describe the following process in a <span class="bold">visual diagram</span>. Can you design a communication piece using the elements provided in this activity?</div>
        <br/>
        <div class="medium-text pad-medium yellow-background rounded bold">The receptor Y is found in the cell membrane. The molecule X binds to the receptor. This triggers the release of proteins by an organelle in the cell.</div>
        <br/>
        <br/>
        <br/>

        <div class="large-text flex-row gap-small">
            <img src="/activity/assets/notebook.svg">
            Instructions
        </div>
        <div class="gap-large flex-column">
            <div class="flex-column lightblue-background rounded gap-medium pad-small">
                <div class="small-text bold">1. Understand the science</div>
                <div class="small-text">We start by researching the topic if we're unfamiliar with the science. This includes searching and referencing visuals, such as diagrams, created by others.</div>
            </div>
            <div class="flex-column lightblue-background rounded gap-medium pad-small">
                <div class="small-text bold">2. Design a communication piece</div>
                <div class="small-text">Once we have a good grasp of the science, we can communicate it to our target audience. We start considering the text that appears in the piece, the placement of visuals, and the balance between text and visuals.</div>
            </div>
            <div class="flex-column lightblue-background rounded gap-medium pad-small">
                <div class="small-text bold">3. Support your design choices</div>
                <div class="small-text">Place a comment next to different parts of your diagram and explain how you've made your design as effective as possible.</div>
            </div>
        </div>
    `,
    elements: {
        text: {
            heading: "Text",
            text: ["TextBox"],
            icons: ["text_box"],
            srcs: ["/activity/assets/text_box.png"],
            sizes: [{ width: 78, height: 27 }],
        },
        lines: {
            heading: "Labels & Arrows",
            icons: [
                "label_left_dot",
                "label_right_dot",
                "label_left_arrow",
                "label_right_arrow",
                "label_left_bent_dot",
                "label_right_bent_dot",
                "label_left_bent_arrow",
                "label_right_bent_arrow",
                "label_left_curve1_arrow",
                "label_right_curve1_arrow",
                "label_left_curve2_arrow",
                "label_right_curve2_arrow",
            ],
            srcs: [
                "/activity/assets/label_left_dot.png",
                "/activity/assets/label_right_dot.png",
                "/activity/assets/label_left_arrow.png",
                "/activity/assets/label_right_arrow.png",
                "/activity/assets/label_left_bent_dot.png",
                "/activity/assets/label_right_bent_dot.png",
                "/activity/assets/label_left_bent_arrow.png",
                "/activity/assets/label_right_bent_arrow.png",
                "/activity/assets/label_left_curve1_arrow.png",
                "/activity/assets/label_right_curve1_arrow.png",
                "/activity/assets/label_left_curve2_arrow.png",
                "/activity/assets/label_right_curve2_arrow.png",
            ],
            sizes: [
                { width: 65, height: 10 },
                { width: 65, height: 10 },
                { width: 65, height: 10 },
                { width: 65, height: 10 },
                { width: 65, height: 25 },
                { width: 65, height: 25 },
                { width: 65, height: 35 },
                { width: 65, height: 35 },
                { width: 65, height: 30 },
                { width: 65, height: 30 },
                { width: 50, height: 50 },
                { width: 50, height: 50 },
            ],
        },
        draw: {
            heading: "Draw",
            contents: [
                {
                    name: "draw-tool",
                    type: "tool",
                    tool: "freehand-draw",
                },
            ],
        },
        shapes: {
            heading: "Shapes",
            shapes: ["rectangle", "circle", "triangle", "rectangle", "circle", "triangle"],
            fill: [true, true, true, false, false, false],
            sizes: [
                { width: 20, height: 20 },
                { width: 20, height: 20 },
                { width: 20, height: 20 },
                { width: 20, height: 20 },
                { width: 20, height: 20 },
                { width: 20, height: 20 },
            ],
        },
        images: {
            heading: "Images",
            sections: [
                {
                    subheading: "Molecule X",
                    icons: [
                        "molecule_purple",
                        "molecule_blue",
                        "molecule_pink",
                        "molecule_yellow",
                        "molecule_white",
                        "molecule_gray",
                    ],
                    srcs: [
                        "/activity/assets/molecule_purple.png",
                        "/activity/assets/molecule_blue.png",
                        "/activity/assets/molecule_pink.png",
                        "/activity/assets/molecule_yellow.png",
                        "/activity/assets/molecule_white.png",
                        "/activity/assets/molecule_gray.png",
                    ],
                    sizes: [
                        { width: 42, height: 42 },
                        { width: 42, height: 42 },
                        { width: 42, height: 42 },
                        { width: 42, height: 42 },
                        { width: 42, height: 42 },
                        { width: 42, height: 42 },
                    ],
                },
                {
                    subheading: "Receptor Y",
                    icons: [
                        "receptor_purple",
                        "receptor_blue",
                        "receptor_pink",
                        "receptor_yellow",
                        "receptor_white",
                        "receptor_gray",
                    ],
                    srcs: [
                        "/activity/assets/receptor_purple.png",
                        "/activity/assets/receptor_blue.png",
                        "/activity/assets/receptor_pink.png",
                        "/activity/assets/receptor_yellow.png",
                        "/activity/assets/receptor_white.png",
                        "/activity/assets/receptor_gray.png",
                    ],
                    sizes: [
                        { width: 42, height: 82 },
                        { width: 42, height: 82 },
                        { width: 42, height: 82 },
                        { width: 42, height: 82 },
                        { width: 42, height: 82 },
                        { width: 42, height: 82 },
                    ],
                },
                {
                    subheading: "Organelle",
                    icons: [
                        "organelle_purple",
                        "organelle_blue",
                        "organelle_pink",
                        "organelle_yellow",
                        "organelle_white",
                        "organelle_gray",
                    ],
                    srcs: [
                        "/activity/assets/organelle_purple.png",
                        "/activity/assets/organelle_blue.png",
                        "/activity/assets/organelle_pink.png",
                        "/activity/assets/organelle_yellow.png",
                        "/activity/assets/organelle_white.png",
                        "/activity/assets/organelle_gray.png",
                    ],
                    sizes: [
                        { width: 65, height: 72 },
                        { width: 65, height: 72 },
                        { width: 65, height: 72 },
                        { width: 65, height: 72 },
                        { width: 65, height: 72 },
                        { width: 65, height: 72 },
                    ],
                },
                {
                    subheading: "Protein",
                    icons: [
                        "protein_purple",
                        "protein_blue",
                        "protein_pink",
                        "protein_yellow",
                        "protein_white",
                        "protein_gray",
                    ],
                    srcs: [
                        "/activity/assets/protein_purple.png",
                        "/activity/assets/protein_blue.png",
                        "/activity/assets/protein_pink.png",
                        "/activity/assets/protein_yellow.png",
                        "/activity/assets/protein_white.png",
                        "/activity/assets/protein_gray.png",
                    ],
                    sizes: [
                        { width: 28, height: 28 },
                        { width: 28, height: 28 },
                        { width: 28, height: 28 },
                        { width: 28, height: 28 },
                        { width: 28, height: 28 },
                        { width: 28, height: 28 },
                    ],
                },
                {
                    subheading: "Cell membranes",
                    icons: [
                        "membrane_1_purple",
                        "membrane_1_blue",
                        "membrane_1_pink",
                        "membrane_1_yellow",
                        "membrane_1_white",
                        "membrane_1_gray",

                        "membrane_2_purple",
                        "membrane_2_blue",
                        "membrane_2_pink",
                        "membrane_2_yellow",
                        "membrane_2_white",
                        "membrane_2_gray",

                        "membrane_3_purple",
                        "membrane_3_blue",
                        "membrane_3_pink",
                        "membrane_3_yellow",
                        "membrane_3_white",
                        "membrane_3_gray",

                        "membrane_4_purple",
                        "membrane_4_blue",
                        "membrane_4_pink",
                        "membrane_4_yellow",
                        "membrane_4_white",
                        "membrane_4_gray",

                        "membrane_5_purple",
                        "membrane_5_blue",
                        "membrane_5_pink",
                        "membrane_5_yellow",
                        "membrane_5_white",
                        "membrane_5_gray",
                    ],
                    srcs: [
                        "/activity/assets/membrane_1_purple.png",
                        "/activity/assets/membrane_1_blue.png",
                        "/activity/assets/membrane_1_pink.png",
                        "/activity/assets/membrane_1_yellow.png",
                        "/activity/assets/membrane_1_white.png",
                        "/activity/assets/membrane_1_gray.png",

                        "/activity/assets/membrane_2_purple.png",
                        "/activity/assets/membrane_2_blue.png",
                        "/activity/assets/membrane_2_pink.png",
                        "/activity/assets/membrane_2_yellow.png",
                        "/activity/assets/membrane_2_white.png",
                        "/activity/assets/membrane_2_gray.png",

                        "/activity/assets/membrane_3_purple.png",
                        "/activity/assets/membrane_3_blue.png",
                        "/activity/assets/membrane_3_pink.png",
                        "/activity/assets/membrane_3_yellow.png",
                        "/activity/assets/membrane_3_white.png",
                        "/activity/assets/membrane_3_gray.png",

                        "/activity/assets/membrane_4_purple.png",
                        "/activity/assets/membrane_4_blue.png",
                        "/activity/assets/membrane_4_pink.png",
                        "/activity/assets/membrane_4_yellow.png",
                        "/activity/assets/membrane_4_white.png",
                        "/activity/assets/membrane_4_gray.png",

                        "/activity/assets/membrane_5_purple.png",
                        "/activity/assets/membrane_5_blue.png",
                        "/activity/assets/membrane_5_pink.png",
                        "/activity/assets/membrane_5_yellow.png",
                        "/activity/assets/membrane_5_white.png",
                        "/activity/assets/membrane_5_gray.png",
                    ],
                    sizes: [
                        { width: 92, height: 48 },
                        { width: 92, height: 48 },
                        { width: 92, height: 48 },
                        { width: 92, height: 48 },
                        { width: 92, height: 48 },
                        { width: 92, height: 48 },

                        { width: 92, height: 50 },
                        { width: 92, height: 50 },
                        { width: 92, height: 50 },
                        { width: 92, height: 50 },
                        { width: 92, height: 50 },
                        { width: 92, height: 50 },

                        { width: 92, height: 24 },
                        { width: 92, height: 24 },
                        { width: 92, height: 24 },
                        { width: 92, height: 24 },
                        { width: 92, height: 24 },
                        { width: 92, height: 24 },

                        { width: 92, height: 36 },
                        { width: 92, height: 36 },
                        { width: 92, height: 36 },
                        { width: 92, height: 36 },
                        { width: 92, height: 36 },
                        { width: 92, height: 36 },

                        { width: 92, height: 92 },
                        { width: 92, height: 92 },
                        { width: 92, height: 92 },
                        { width: 92, height: 92 },
                        { width: 92, height: 92 },
                        { width: 92, height: 92 },
                    ],
                },
            ],
        },
    },
    info: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque malesuada quis nulla a porta. Quisque aliquet eros at efficitur dictum. Morbi semper interdum hendrerit. Donec at leo ut augue fermentum pellentesque. Proin nec diam eu velit feugiat tempor. Proin placerat, odio fermentum fermentum ullamcorper, urna ante mattis erat, vel commodo quam dolor sit amet nulla. Donec neque quam, condimentum in tortor a, fermentum pellentesque lectus. Sed vitae lorem volutpat magna sagittis euismod.
    `,
    color_palette: ["#9b6bc4", "#7b94fb", " #e55a8a", "#f7b05a ", "#dddddd", "#737273 "],
};

export default activity_visual_strategies;
