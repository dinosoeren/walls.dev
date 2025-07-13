// Custom Editor Component for LightGallery Shortcode
// Wait for CMS to be available before registering the component
(function () {
  let retryCount = 0;
  const maxRetries = 5;

  function registerLightGalleryComponent() {
    if (typeof CMS === "undefined") {
      // If CMS is not available yet, try again in a moment (up to maxRetries times)
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(registerLightGalleryComponent, 100);
      } else {
        console.warn(
          "LightGallery component: CMS not available after",
          maxRetries,
          "retries. Component registration failed."
        );
      }
      return;
    }

    // LightGallery Component
    CMS.registerEditorComponent({
      id: "lightgallery",
      label: "Image Gallery",
      fields: [
        {
          name: "glob",
          label: "Page Bundle Images (glob)",
          widget: "string",
          required: false,
          hint: "e.g., images/*.png, images/*.{jpg,png}, images/screenshots/*.jpg",
        },
        {
          name: "assets",
          label: "Assets Directory Images (assets)",
          widget: "string",
          required: false,
          hint: "e.g., images/project/*.png, images/blog/*.{jpg,png}",
        },
      ],
      pattern: /{{<\s*lightgallery\s+([\s\S]*?)\s*>}}/m,
      fromBlock: function (match) {
        const attributes = match[1];
        const data = {};

        const attrRegex = /(\w+)="([^"]*)"/g;
        let attrMatch;

        while ((attrMatch = attrRegex.exec(attributes)) !== null) {
          const [, name, value] = attrMatch;
          data[name] = value;
        }

        return data;
      },
      toBlock: function (data) {
        const attributes = Object.entries(data)
          .filter(([, value]) => value && value.trim() !== "")
          .map(([key, value]) => `\n  ${key}="${value}"`)
          .join(" ");

        return `{{< lightgallery ${attributes} \n>}}`;
      },
      toPreview: function (data) {
        const globPattern = data.glob || "";
        const assetsPattern = data.assets || "";
        const pattern = globPattern || assetsPattern || "No pattern specified";

        return `
<div style="border: 2px dashed #ccc; padding: 20px; text-align: center; border-radius: 8px; background: #f9f9f9;">
  <div style="font-size: 24px; margin: 10px 0;">🖼️</div>
  <div style="font-weight: bold; color: #666;">Image Gallery</div>
  <div style="font-size: 12px; color: #999; margin-top: 5px;">Pattern: ${pattern}</div>
  <div style="font-size: 11px; color: #aaa; margin-top: 3px;">Images will be loaded automatically</div>
</div>
`;
      },
    });
  }

  // Start the registration process
  registerLightGalleryComponent();
})();
