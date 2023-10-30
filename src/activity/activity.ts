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
    color_palette: {
        colors: string[];
        color_picker: boolean;
    };
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
        <div class="medium-text pad-medium yw-background rounded bold">The receptor Y is found in the cell membrane. The molecule X binds to the receptor. This triggers the release of proteins by an organelle in the cell.</div>
        <br/>
        <br/>
        <br/>

        <div class="large-text flex-row gap-small">
            <img src="/activity/assets/notebook.svg">
            Instructions
        </div>
        <div class="gap-large flex-column">
            <div class="flex-column lightbl-background rounded gap-medium pad-small">
                <div class="small-text bold">1. Understand the science</div>
                <div class="small-text">We start by researching the topic if we're unfamiliar with the science. This includes searching and referencing visuals, such as diagrams, created by others.</div>
            </div>
            <div class="flex-column lightbl-background rounded gap-medium pad-small">
                <div class="small-text bold">2. Design a communication piece</div>
                <div class="small-text">Once we have a good grasp of the science, we can communicate it to our target audience. We start considering the text that appears in the piece, the placement of visuals, and the balance between text and visuals.</div>
            </div>
            <div class="flex-column lightbl-background rounded gap-medium pad-small">
                <div class="small-text bold">3. Support your design choices</div>
                <div class="small-text">Place a comment next to different parts of your diagram and explain how you've made your design as effective as possible.</div>
            </div>
        </div>
    `,
    elements: {
        text: {
            heading: "Text",
        },
        lines: {
            heading: "Labels & Arrows",
            icons: [
                "label_straight_left",
                "label_straight_right",
                "arrow_straight_left",
                "arrow_straight_right",
                "label_angle_left",
                "label_angle_right",
                "arrow_angle_left",
                "arrow_angle_right",
                "arrow_curve1_left",
                "arrow_curve1_right",
                "arrow_curve2_left",
                "arrow_curve2_right",
            ],
            srcs: [
                "/activity/assets/label_straight_left.png",
                "/activity/assets/label_straight_right.png",
                "/activity/assets/arrow_straight_left.png",
                "/activity/assets/arrow_straight_right.png",
                "/activity/assets/label_angle_left.png",
                "/activity/assets/label_angle_right.png",
                "/activity/assets/arrow_angle_left.png",
                "/activity/assets/arrow_angle_right.png",
                "/activity/assets/arrow_curve1_left.png",
                "/activity/assets/arrow_curve1_right.png",
                "/activity/assets/arrow_curve2_left.png",
                "/activity/assets/arrow_curve2_right.png",
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
                        "molecule_pu",
                        "molecule_bl",
                        "molecule_pk",
                        "molecule_yw",
                        "molecule_wh",
                        "molecule_gr",
                    ],
                    srcs: [
                        "/activity/assets/molecule_pu.png",
                        "/activity/assets/molecule_bl.png",
                        "/activity/assets/molecule_pk.png",
                        "/activity/assets/molecule_yw.png",
                        "/activity/assets/molecule_wh.png",
                        "/activity/assets/molecule_gr.png",
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
                        "receptor_pu",
                        "receptor_bl",
                        "receptor_pk",
                        "receptor_yw",
                        "receptor_wh",
                        "receptor_gr",
                    ],
                    srcs: [
                        "/activity/assets/receptor_pu.png",
                        "/activity/assets/receptor_bl.png",
                        "/activity/assets/receptor_pk.png",
                        "/activity/assets/receptor_yw.png",
                        "/activity/assets/receptor_wh.png",
                        "/activity/assets/receptor_gr.png",
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
                        "organelle_pu",
                        "organelle_bl",
                        "organelle_pk",
                        "organelle_yw",
                        "organelle_wh",
                        "organelle_gr",
                    ],
                    srcs: [
                        "/activity/assets/organelle_pu.png",
                        "/activity/assets/organelle_bl.png",
                        "/activity/assets/organelle_pk.png",
                        "/activity/assets/organelle_yw.png",
                        "/activity/assets/organelle_wh.png",
                        "/activity/assets/organelle_gr.png",
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
                        "protein_pu",
                        "protein_bl",
                        "protein_pk",
                        "protein_yw",
                        "protein_wh",
                        "protein_gr",
                    ],
                    srcs: [
                        "/activity/assets/protein_pu.png",
                        "/activity/assets/protein_bl.png",
                        "/activity/assets/protein_pk.png",
                        "/activity/assets/protein_yw.png",
                        "/activity/assets/protein_wh.png",
                        "/activity/assets/protein_gr.png",
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
                        "membrane_1_pu",
                        "membrane_1_bl",
                        "membrane_1_pk",
                        "membrane_1_yw",
                        "membrane_1_wh",
                        "membrane_1_gr",

                        "membrane_2_pu",
                        "membrane_2_bl",
                        "membrane_2_pk",
                        "membrane_2_yw",
                        "membrane_2_wh",
                        "membrane_2_gr",

                        "membrane_3_pu",
                        "membrane_3_bl",
                        "membrane_3_pk",
                        "membrane_3_yw",
                        "membrane_3_wh",
                        "membrane_3_gr",

                        "membrane_4_pu",
                        "membrane_4_bl",
                        "membrane_4_pk",
                        "membrane_4_yw",
                        "membrane_4_wh",
                        "membrane_4_gr",

                        "membrane_5_pu",
                        "membrane_5_bl",
                        "membrane_5_pk",
                        "membrane_5_yw",
                        "membrane_5_wh",
                        "membrane_5_gr",
                    ],
                    srcs: [
                        "/activity/assets/membrane_1_pu.png",
                        "/activity/assets/membrane_1_bl.png",
                        "/activity/assets/membrane_1_pk.png",
                        "/activity/assets/membrane_1_yw.png",
                        "/activity/assets/membrane_1_wh.png",
                        "/activity/assets/membrane_1_gr.png",

                        "/activity/assets/membrane_2_pu.png",
                        "/activity/assets/membrane_2_bl.png",
                        "/activity/assets/membrane_2_pk.png",
                        "/activity/assets/membrane_2_yw.png",
                        "/activity/assets/membrane_2_wh.png",
                        "/activity/assets/membrane_2_gr.png",

                        "/activity/assets/membrane_3_pu.png",
                        "/activity/assets/membrane_3_bl.png",
                        "/activity/assets/membrane_3_pk.png",
                        "/activity/assets/membrane_3_yw.png",
                        "/activity/assets/membrane_3_wh.png",
                        "/activity/assets/membrane_3_gr.png",

                        "/activity/assets/membrane_4_pu.png",
                        "/activity/assets/membrane_4_bl.png",
                        "/activity/assets/membrane_4_pk.png",
                        "/activity/assets/membrane_4_yw.png",
                        "/activity/assets/membrane_4_wh.png",
                        "/activity/assets/membrane_4_gr.png",

                        "/activity/assets/membrane_5_pu.png",
                        "/activity/assets/membrane_5_bl.png",
                        "/activity/assets/membrane_5_pk.png",
                        "/activity/assets/membrane_5_yw.png",
                        "/activity/assets/membrane_5_wh.png",
                        "/activity/assets/membrane_5_gr.png",
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
    color_palette: {
        colors: [
            "transparent",
            "#9b6bc4",
            "#7b94fb",
            " #e55a8a",
            "#f7b05a ",
            "#dddddd",
            "#737273 ",
        ],
        color_picker: true,
    },
};

export default activity_visual_strategies;
