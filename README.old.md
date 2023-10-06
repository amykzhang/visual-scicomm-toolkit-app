# bmc-app

UofT BMC web app project 2023

##

-   increase zoom constant ✅
-   select tool makes canvas undraggable ✅

## August 18

-   Zoom in/out on center ✅
-   .png shapes and elements ✅
-   Drag and drop elements ✅
-   save local storage ✅
-   select elements ✅
-   resize elements ✅

### August 31

-   sharing: ✅
    -   exporting as Image (jpeg, png, pdf), with comments or no comments ✅
-   comment view
    -   toggle comment view ✅
    -   add comment elements
    -   hide comment elements when comment view is off
-   missing subtask paragraph ✅
-   make background colour grey #d6d6d6 ✅
-   rename lines to labels & arrows ✅
-   fix shortcuts for commands
-   rework drag with selection to use selection IDs instead of isDragging
-   Export button indicate hover and selection, pointer
-   Info modal window 70vw 50vh
-   Info and Settings same box as squaretool
-   blue background on hover for sidebar minimize and expand
-   remove grey outline for hover
-   no indicator for hover for zoom percentage
-   check background margin/padding for activitypanel
-   padding around the sidebar (20px)
-   bacground around element rows
-   grey seperating bar between tools

    ## September 7

-   drag select bounding box
-   undo/redo (https://konvajs.org/docs/react/Undo-Redo.html)
-   text box (https://konvajs.org/docs/sandbox/Editable_Text.html)
-   freehand draw (https://konvajs.org/docs/sandbox/Free_Drawing.html)
    -   new section freehand tool
-   contextmenu for copy paste change color etc.
-   bars should have icon still there and title to be there when scroll
-   refactor activity.ts for keywords (image, tool) and subsequent information (image url, image name)

## September 14

Debugging

Nice-to-haves:

-   Zoom in/out shortcuts
-   Change colour of images
-   Adustable Lines and arrows, variable stroke length and bend

Sharable Link (optional):

-   room with uuid that saves to server
-   node.js server with pouchdb

SEPTEMBER 13:

-   Rework color.ts ✅
-   Export button: hover, selected, pointer ✅
-   Modify info window: 70vw 50vh ✅
-   Modify Info and Settings same box as SquareTool component ✅
-   Add blue background on hover for sidebar minimize and expand ✅
-   Remove grey outline for hover ✅
-   Remove hover blue background for zoom percentage ✅
-   Modify background margin/padding for ActivityPanel to figma specs ✅
-   Add padding around the sidebar for scrolling (20px) ✅
-   Add Background around element rows ✅
-   Add grey line between tools in ToolBar and ZoomBar ✅

SEPTEMBER 14:

-   Multiple select: rework drag with selection to use selection IDs instead of isDragging ✅
-   drag select bounding box ✅
-   Comment elements (text, change text onClick) ✅
    -   resize✅
    -   edit✅
    -   delete ✅
    -   persistance text ✅
    -   persistance position ✅
    -   persistance size ✅

SEPTEMBER 21:

-   Shapes Elements ✅

October 3:

-   Comment edit mode adjustments ✅

October 4:

-   text box : transfer comment fixes to text (height adjustments, delete, edit... )✅

October 5:

-   freehand draw (https://konvajs.org/docs/sandbox/Free_Drawing.html) (2h)
-   Undo/redo stack (https://konvajs.org/docs/react/Undo-Redo.html) (2h)✅
-   contextmenu for copy paste change color etc. (3h)
-   Add shortcuts for commands (1h)
-   tooltips !
-   Add support for chrome, safari, firefox, edge (2h)
-   Landing Page (look into it) (1h)

Production and staging servers: t
document code, how to deploy, how to run, how to test

nice-to-haves:

-   elements: shift locks onto rails while dragging
-   shapes: shift to lock dimensions while resizing, lock onto dimensions

October 6:: testing

OCTOBER 8 :: APP DEADLINE

OCTOBER 15 :: PAPER SUBMISSION DEADLINE

buggies:

-   fullscreen doesnt render stage when changing vw/vh

context menu 1:

-   colour
-   stroke

context menu 2:

-   text

28 notes:

-   ContextMenu:
    -   edit (text)
    -   copy
    -   paste
    -   bring to front
    -   send to back
    -   delete
    -   change color (shape)
        ![ContextMenu](image.png)
