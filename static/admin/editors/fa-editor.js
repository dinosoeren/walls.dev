// Custom Editor Component for FontAwesome Shortcode
(function () {
  let retryCount = 0;
  const maxRetries = 5;

  function registerFAComponent() {
    if (typeof CMS === "undefined") {
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(registerFAComponent, 100);
      } else {
        console.warn(
          "FontAwesome component: CMS not available after",
          maxRetries,
          "retries. Component registration failed."
        );
      }
      return;
    }

    CMS.registerEditorComponent({
      id: "fa",
      label: "FontAwesome Icon",
      fields: [
        {
          name: "icon",
          label: "Icon Name",
          widget: "string",
          required: true,
          hint: "Enter the icon name (e.g., 'heart', 'github', 'user', 'star')",
        },
        {
          name: "style",
          label: "Icon Style",
          widget: "select",
          options: [
            { label: "Regular (Default)", value: "regular" },
            { label: "Solid", value: "solid" },
            { label: "Brand", value: "brand" },
            { label: "Light", value: "light" },
            { label: "Duotone", value: "duotone" },
          ],
          default: "regular",
          required: false,
        },
        {
          name: "size",
          label: "Icon Size",
          widget: "select",
          options: [
            { label: "Default", value: "" },
            { label: "Extra Small", value: "xs" },
            { label: "Small", value: "sm" },
            { label: "Large", value: "lg" },
            { label: "2x", value: "2x" },
            { label: "3x", value: "3x" },
            { label: "4x", value: "4x" },
            { label: "5x", value: "5x" },
            { label: "6x", value: "6x" },
            { label: "7x", value: "7x" },
            { label: "8x", value: "8x" },
            { label: "9x", value: "9x" },
            { label: "10x", value: "10x" },
          ],
          default: "",
          required: false,
        },
        {
          name: "class",
          label: "Additional CSS Classes",
          widget: "string",
          required: false,
          hint: "Add custom CSS classes (e.g., 'text-red-500', 'mr-2')",
        },
      ],
      pattern: /{{<\s*fa\s+([\s\S]*?)\s*>}}/m,
      fromBlock: function (match) {
        const attributes = match[1];
        const data = {};

        const attrRegex = /(\w+)="([^"]*)"/g;
        let attrMatch;

        while ((attrMatch = attrRegex.exec(attributes)) !== null) {
          const [, name, value] = attrMatch;
          data[name] = value;
        }

        // Convert style attributes to the style field
        if (data.brand === "true") {
          data.style = "brand";
        } else if (data.solid === "true") {
          data.style = "solid";
        } else if (data.regular === "true") {
          data.style = "regular";
        } else if (data.light === "true") {
          data.style = "light";
        } else if (data.duotone === "true") {
          data.style = "duotone";
        } else {
          data.style = "regular";
        }

        return data;
      },
      toBlock: function (data) {
        const attributes = [];

        if (data.icon) {
          attributes.push(`icon="${data.icon}"`);
        }

        if (data.size) {
          attributes.push(`size="${data.size}"`);
        }

        if (data.class) {
          attributes.push(`class="${data.class}"`);
        }

        // Convert style to appropriate boolean attributes
        if (data.style === "brand") {
          attributes.push('brand="true"');
        } else if (data.style === "solid") {
          attributes.push('solid="true"');
        } else if (data.style === "light") {
          attributes.push('light="true"');
        } else if (data.style === "duotone") {
          attributes.push('duotone="true"');
        } else {
          attributes.push('regular="true"');
        }

        const attributesStr = attributes.join(" ");
        return `{{< fa ${attributesStr} >}}`;
      },
      toPreview: function (data) {
        const icon = data.icon || "question";
        const style = data.style || "regular";
        const size = data.size || "";
        const classes = data.class || "";

        let prefix = "fa";
        if (style === "brand") {
          prefix = "fab";
        } else if (style === "solid") {
          prefix = "fas";
        } else if (style === "light") {
          prefix = "fal";
        } else if (style === "duotone") {
          prefix = "fad";
        } else {
          prefix = "far";
        }

        const sizeClass = size ? ` fa-${size}` : "";
        const customClasses = classes ? ` ${classes}` : "";

        return `<i class="${prefix} fa-${icon}${sizeClass}${customClasses}" style="color: #007cba; font-size: 1.2em;"></i>`;
      },
    });
  }

  registerFAComponent();
})();
