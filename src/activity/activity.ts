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
            <img src="/activity/notebook.svg">
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
                "label-straight-left",
                "label-straight-right",
                "arrow-straight-left",
                "arrow-straight-right",
                "label-angle-left",
                "label-angle-right",
                "arrow-angle-left",
                "arrow-angle-right",
                "arrow-curve1-left",
                "arrow-curve1-right",
                "arrow-curve2-left",
                "arrow-curve2-right",
            ],
            srcs: [
                "/activity/label-straight-left.png",
                "/activity/label-straight-right.png",
                "/activity/arrow-straight-left.png",
                "/activity/arrow-straight-right.png",
                "/activity/label-angle-left.png",
                "/activity/label-angle-right.png",
                "/activity/arrow-angle-left.png",
                "/activity/arrow-angle-right.png",
                "/activity/arrow-curve1-left.png",
                "/activity/arrow-curve1-right.png",
                "/activity/arrow-curve2-left.png",
                "/activity/arrow-curve2-right.png",
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
                        "molecule-pu",
                        "molecule-bl",
                        "molecule-pk",
                        "molecule-yw",
                        "molecule-wh",
                        "molecule-gr",
                    ],
                    srcs: [
                        "/activity/molecule-pu.png",
                        "/activity/molecule-bl.png",
                        "/activity/molecule-pk.png",
                        "/activity/molecule-yw.png",
                        "/activity/molecule-wh.png",
                        "/activity/molecule-gr.png",
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
                        "receptor-pu",
                        "receptor-bl",
                        "receptor-pk",
                        "receptor-yw",
                        "receptor-wh",
                        "receptor-gr",
                    ],
                    srcs: [
                        "/activity/receptor-pu.png",
                        "/activity/receptor-bl.png",
                        "/activity/receptor-pk.png",
                        "/activity/receptor-yw.png",
                        "/activity/receptor-wh.png",
                        "/activity/receptor-gr.png",
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
                        "organelle-pu",
                        "organelle-bl",
                        "organelle-pk",
                        "organelle-yw",
                        "organelle-wh",
                        "organelle-gr",
                    ],
                    srcs: [
                        "/activity/organelle-pu.png",
                        "/activity/organelle-bl.png",
                        "/activity/organelle-pk.png",
                        "/activity/organelle-yw.png",
                        "/activity/organelle-wh.png",
                        "/activity/organelle-gr.png",
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
                        "protein-pu",
                        "protein-bl",
                        "protein-pk",
                        "protein-yw",
                        "protein-wh",
                        "protein-gr",
                    ],
                    srcs: [
                        "/activity/protein-pu.png",
                        "/activity/protein-bl.png",
                        "/activity/protein-pk.png",
                        "/activity/protein-yw.png",
                        "/activity/protein-wh.png",
                        "/activity/protein-gr.png",
                    ],
                    sizes: [
                        { width: 32, height: 32 },
                        { width: 32, height: 32 },
                        { width: 32, height: 32 },
                        { width: 32, height: 32 },
                        { width: 32, height: 32 },
                        { width: 32, height: 32 },
                    ],
                },
                {
                    subheading: "Cell membranes",
                    icons: [
                        "membrane4-pu",
                        "membrane4-bl",
                        "membrane4-pk",
                        "membrane4-yw",
                        "membrane4-wh",
                        "membrane4-gr",

                        "membrane5-pu",
                        "membrane5-bl",
                        "membrane5-pk",
                        "membrane5-yw",
                        "membrane5-wh",
                        "membrane5-gr",

                        "membrane3-pu",
                        "membrane3-bl",
                        "membrane3-pk",
                        "membrane3-yw",
                        "membrane3-wh",
                        "membrane3-gr",

                        "membrane2-pu",
                        "membrane2-bl",
                        "membrane2-pk",
                        "membrane2-yw",
                        "membrane2-wh",
                        "membrane2-gr",

                        "membrane1-pu",
                        "membrane1-bl",
                        "membrane1-pk",
                        "membrane1-yw",
                        "membrane1-wh",
                        "membrane1-gr",
                    ],
                    srcs: [
                        "/activity/membrane4-pu.png",
                        "/activity/membrane4-bl.png",
                        "/activity/membrane4-pk.png",
                        "/activity/membrane4-yw.png",
                        "/activity/membrane4-wh.png",
                        "/activity/membrane4-gr.png",

                        "/activity/membrane5-pu.png",
                        "/activity/membrane5-bl.png",
                        "/activity/membrane5-pk.png",
                        "/activity/membrane5-yw.png",
                        "/activity/membrane5-wh.png",
                        "/activity/membrane5-gr.png",

                        "/activity/membrane3-pu.png",
                        "/activity/membrane3-bl.png",
                        "/activity/membrane3-pk.png",
                        "/activity/membrane3-yw.png",
                        "/activity/membrane3-wh.png",
                        "/activity/membrane3-gr.png",

                        "/activity/membrane2-pu.png",
                        "/activity/membrane2-bl.png",
                        "/activity/membrane2-pk.png",
                        "/activity/membrane2-yw.png",
                        "/activity/membrane2-wh.png",
                        "/activity/membrane2-gr.png",

                        "/activity/membrane1-pu.png",
                        "/activity/membrane1-bl.png",
                        "/activity/membrane1-pk.png",
                        "/activity/membrane1-yw.png",
                        "/activity/membrane1-wh.png",
                        "/activity/membrane1-gr.png",
                    ],
                    sizes: [
                        { width: 92, height: 39 },
                        { width: 92, height: 39 },
                        { width: 92, height: 39 },
                        { width: 92, height: 39 },
                        { width: 92, height: 39 },
                        { width: 92, height: 39 },

                        { width: 92, height: 35 },
                        { width: 92, height: 35 },
                        { width: 92, height: 35 },
                        { width: 92, height: 35 },
                        { width: 92, height: 35 },
                        { width: 92, height: 35 },

                        { width: 92, height: 12 },
                        { width: 92, height: 12 },
                        { width: 92, height: 12 },
                        { width: 92, height: 12 },
                        { width: 92, height: 12 },
                        { width: 92, height: 12 },

                        { width: 92, height: 27 },
                        { width: 92, height: 27 },
                        { width: 92, height: 27 },
                        { width: 92, height: 27 },
                        { width: 92, height: 27 },
                        { width: 92, height: 27 },

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
        colors: ["transparent", "#9b6bc4", "#7b94fb", " #e55a8a", "#f7b05a", "#dddddd", "#737273 "],
        color_picker: true,
    },
};

export default activity_visual_strategies;
