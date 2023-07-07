export type Activity = {
    name: string;
    task: {
        container: string;
        body: string;
    }[];
    instructions: {
        step: string;
        body: string;
    }[];
    elements: {
        text: {
            heading: string;
            tools: {
                name: string;
                icon: string;
                toolid: string;
            }[];
        };
        lines: {
            heading: string;
            tools: {
                name: string;
                icon: string;
                toolid: string;
            }[];
        };
        shapes: {
            heading: string;
            tools: {
                name: string;
                icon: string;
                toolid: string;
            }[];
        };
        images: {
            heading: string;
            sections: {
                subheading: string;
                icons: string[];
                src: string[];
            }[];
        };
    };
};

const activity_visual_strategies: Activity = {
    name: "Visual Strategies",
    task: [
        {
            container: "paragraph",
            body: "You’re a researcher who wants to describe the following process in a <b>visual diagram</b>. Can you design a communication piece using the elements provided in this activity?",
        },
        {
            container: "focused-paragraph",
            body: "The receptor Y is found in the cell membrane. The molecule X binds to the receptor. This triggers the release of proteins by an organelle in the cell.",
        },
    ],
    instructions: [
        {
            step: "1. Understand the science",
            body: "We start by researching the topic if we’re unfamiliar with the science. This includes searching and referencing visuals, such as diagrams, created by others.",
        },
        {
            step: "2. Design a communication piece",
            body: "Once we have a good grasp of the science, we can communicate it to our target audience. We start considering the text that appears in the piece, the placement of visuals, and the balance between text and visuals.",
        },
        {
            step: "3. Support your design choices",
            body: "Place a comment next to different parts of your diagram and explain how you’ve made your design as effective as possible.",
        },
    ],
    elements: {
        text: {
            heading: "Text",
            tools: [
                {
                    name: "Text Box",
                    icon: "text-box",
                    toolid: "text",
                },
            ],
        },
        lines: {
            heading: "Lines",
            tools: [
                {
                    name: "freehand",
                    icon: "freehand",
                    toolid: "draw",
                },
            ],
        },
        shapes: {
            heading: "Shapes",
            tools: [],
        },
        images: {
            heading: "Images",
            sections: [
                {
                    subheading: "Molecule X",
                    icons: [
                        "molecule-x-purple",
                        "molecule-x-blue",
                        "molecule-x-pink",
                        "molecule-x-orange",
                        "molecule-x-white",
                        "molecule-x-grey",
                    ],
                    src: [
                        "/src/activity/assets/molecule-x-purple.png",
                        "/src/activity/assets/molecule-x-blue.png",
                        "/src/activity/assets/molecule-x-pink.png",
                        "/src/activity/assets/molecule-x-orange.png",
                        "/src/activity/assets/molecule-x-white.png",
                        "/src/activity/assets/molecule-x-grey.png",
                    ],
                },
                {
                    subheading: "Receptor Y",
                    icons: [
                        "receptor-y-purple",
                        "receptor-y-blue",
                        "receptor-y-pink",
                        "receptor-y-orange",
                        "receptor-y-white",
                        "receptor-y-grey",
                    ],
                    src: [
                        "/src/activity/assets/receptor-y-purple.png",
                        "/src/activity/assets/receptor-y-blue.png",
                        "/src/activity/assets/receptor-y-pink.png",
                        "/src/activity/assets/receptor-y-orange.png",
                        "/src/activity/assets/receptor-y-white.png",
                        "/src/activity/assets/receptor-y-grey.png",
                    ],
                },
                {
                    subheading: "Organelle",
                    icons: [
                        "organelle-purple",
                        "organelle-blue",
                        "organelle-pink",
                        "organelle-orange",
                    ],
                    src: [
                        "/src/activity/assets/organelle-purple.png",
                        "/src/activity/assets/organelle-blue.png",
                        "/src/activity/assets/organelle-pink.png",
                        "/src/activity/assets/organelle-orange.png",
                    ],
                },
                {
                    subheading: "Protein",
                    icons: [
                        "protein-purple",
                        "protein-blue",
                        "protein-pink",
                        "protein-orange",
                        "protein-white",
                        "protein-grey",
                    ],
                    src: [
                        "/src/activity/assets/protein-purple.png",
                        "/src/activity/assets/protein-blue.png",
                        "/src/activity/assets/protein-pink.png",
                        "/src/activity/assets/protein-orange.png",
                        "/src/activity/assets/protein-white.png",
                        "/src/activity/assets/protein-grey.png",
                    ],
                },
                {
                    subheading: "Cell membranes",
                    icons: [
                        "cell-membrane-purple",
                        "cell-membrane-blue",
                        "cell-membrane-pink",
                    ],
                    src: [
                        "/src/activity/assets/cell-membrane-purple.png",
                        "/src/activity/assets/cell-membrane-blue.png",
                        "/src/activity/assets/cell-membrane-pink.png",
                    ],
                },
            ],
        },
    },
};

export default activity_visual_strategies;
