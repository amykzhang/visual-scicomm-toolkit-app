# Visual Science Communication Toolkit

This repository is contains the interactive drag-and-drop activity of the Visual Science Communication Toolkit module. The browser-based activity tasks students with designing a diagram depicting a hypothetical molecular process, utilizing a set of provided illustrations. At the end of the activity, students justify their design decisions using comment boxes placed over their diagram. [Try it out!](https://visual-scicomm-toolkit.vercel.app/)

## About

The project is built using modern web technologies to provide a seamless and intuitive user experience. The web app allows users to design a diagram using provided sets of images, shapes, lines, as well as tools for drawing and text. Progress is saved in the browser and users can download a snapshot of their design for sharing. The project is designed to be flexible and extensible, allowing for easy integration of new activities and features.

See more about the complete module: [Visual Science Communication Toolkit](https://bmc1.utm.utoronto.ca/~amyz/visual_scicomm/)

### Example

Using the elements provided in the activity, design a communication piece that describes the following process:

> The receptor Y is found in the cell membrane. The molecule X binds to the receptor. This triggers the release of proteins by an organelle in the cell.

<img width="1440" alt="image" src="https://github.com/chetbae/vsctoolkit/assets/48145854/babdbf2f-c43a-4ce5-b50d-bd1c5202d1cd">

## Developer Guide

The project is a client-side web app built with React and the Konva and react-tooltips libraries. See more in `developer-guide.md`.

To get started with the Visual Science Communication Toolkit:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Making a New Activity

To create a new activity using the toolkit's basic whiteboard features, follow these steps:

1. Replace `src/activity.ts` with your new activity following the same schema.
2. Add your images, activity descriptions, and extra information to the `public/activity/` folder.
3. Run the toolkit, and your new activity will be available for selection.
