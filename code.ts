// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".

figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
let backgroundHex;

// figma.ui.postMessage({type: 'selectionChange', pluginMessage: backgroundHex});

figma.ui.postMessage('test')

figma.ui.onmessage = async event => {

  if (event.type === 'get-selection') {
    // Get the selection and make sure there are enough components

    if (figma.currentPage.selection.length < 2) {
      console.log('Please select more components');
    } else {
      // Ensure there is at least 1 text node and one other kind of node selected
      let textNode;
      let backgroundNode;

      for (const node of figma.currentPage.selection) {
        if (node.type == "TEXT") {
          // Ensure there is at least 1 text node
          textNode = node;
        } else {
          backgroundNode = node;
        }
      }

      if (textNode && backgroundNode) {
        // Ensure the background is actually the background
        // (check for overlap)
        if (textNode.y >= backgroundNode.y &&
          textNode.y <= backgroundNode.y + backgroundNode.height &&
          textNode.x >= backgroundNode.x &&
          textNode.x <= backgroundNode.x + backgroundNode.width) {
            let backgroundFills = backgroundNode.fills[0].color;

            // console.log('bgfills', backgroundFills)


          // Convert colors to hex

          function componentToHex(c): String {
            var hex = (Math.round(c * 255)).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
          }

          // console.log('hex?', (Math.round(backgroundFills.r * 255)).toString(16));

          function rgba2hex(r: Number, g: Number, b: Number): String {
            let output = [componentToHex(r),
              componentToHex(g),
              componentToHex(b),
            ];

            output.forEach(function (part, i) {
              if (part.length === 1) {
                output[i] = '0' + part;
              }
            })
            return ('#' + output.join(''));
          }
          backgroundHex = rgba2hex(backgroundFills.r, backgroundFills.g, backgroundFills.b);

          console.log('message posting...')



        } else {
          console.log('Components do not overlap');
        }
      }

    }
sendColorInfo();

   }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.

  function sendColorInfo() {

    figma.ui.postMessage(42);
    figma.ui.postMessage({ type: 'selectionChange', pluginMessage: 'test' });

  }


  figma.closePlugin();
};
