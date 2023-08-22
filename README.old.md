# bmc-app
UofT BMC web app project 2023

Project Goals by amy's return

Functioning application with elements/shapes/UI
Minimum functions:
- Zoom in/out on center ✅
- .png shapes and elements ✅
- Drag and drop elements ✅
- save local storage ✅
- select elements   
- resize elements
- sharing:
  - exporting as Image (jpeg, png, pdf), with comments or no comments
  - Sharable link with interface allowing edits
- undo/redo (https://konvajs.org/docs/react/Undo-Redo.html)
- text box (https://konvajs.org/docs/sandbox/Editable_Text.html)
- freehand draw (https://konvajs.org/docs/sandbox/Free_Drawing.html)
- contextmenu for copy paste change color etc.
- comment view
  - toggle comment view
  - add comment elements
  - hide comment elements when comment view is off


Nice-to-haves:
- Zoom in/out shortcuts
- Change colour of images
- Adustable Lines and arrows, variable stokroke length and bend


Aug 18:
- increase zoom constant
- select tool makes canvas undraggable
- make ackground colour grey #d6d6d6
- make dropped immage 150%-200% larger
- rename lines to labels & arrows
- new section freehand tool
- improve zoom handling, increase constant to 1.1
- missing subtask paragrap
- light blue background behind instructions
- bars should have icon still there and title to be there when scroll



Sharable Link (optional):
- room with uuid that saves to server
- node.js server with pouchdb