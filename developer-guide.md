# Overview

The application is a single page whiteboard application. It's developed to dynamically generate certain elements and content based on the given activity.

Panels refer to the top layer of user interface with tools (e.g. TextBox or image elements) or rich text (Left-hand instructional tab). The whiteboard is built with the **Konva** (react-konva) framework and associated components are named ...Elements. Whiteboard and panel state is persisted through local storage in the browser and handled in `persistance.ts`. Styling is done through **styled-components** and tooltips are provided through the **react-tooltips** library

# Activites

Activities can be defined in `activities.ts` and assets for use in activities updated.

The current software is architected to require some basic fields for instructions, element asset names/dimensions, etc, but if specific features are required for the toolkit, `activity.ts` and its type can be modified and and then subsequent changes in code.

## activity.ts

```
// An example of the Activity type

type Activity = {
    name: string;                       // define name of activity
    canvas_size: {
        width: number;
        height: number;
    };
    activity_panel: string;             // Rich Text for ActivityPanel
    elements: {
        text: {
            heading: string;
        };

        ...

        images: {
            heading: string;
            sections: {
                subheading: string;
                icons: string[];
                srcs: string[];
                sizes: {
                    width: number;      // define width and height of image
                    height: number;
                }[];
            }[];
        };
    };
    color_palette: {
        colors: string[];               // define color palette
        color_picker: boolean;          // include html color picker?
    };
};
```

## Assets

Assets required for dynamically generated elements and in rich text should be uploaded to `/public/activity`.

# Konva

[Konva](www.google.com) is a well maintained and versatile library for creating whiteboard applications and suits our purpose very well. A couple of useful out-of-the-box features include the Transformer and shape elements.

## Stage navigation

Zoom and panning is implemented via scaling and dragging the Konva Stage, which acts as the canvas for which elements can be built on. See `StageViewManager.ts` in the hooks folder.

## Transforming

All elements except for comment elements are contained within the same Layer. In this layer, selected elements ids are added to `groupSelection` state which effects the Transformer component, which is the applied to all selected elements. Tranformation behaviour for individual elements are defined in their respective components.

## History

Visual Toolkit allows users to undo/redo actions. A stack is created on load in `App.ts` and each action that affects any element or group selection effects the history stack. A limit of 200 is set for memory's sake.

# Deployment

The app is built using React create-react-app and yarn package manager. It is currently deployed on the web using Vercel. Deploying off your own server should be as simple as `yarn build` and taking the build folder and serving it.

# Example: making a new activity
