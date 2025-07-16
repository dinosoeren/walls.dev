// Custom Editor Components for Button Shortcodes
// Wait for CMS to be available before registering the components
(function () {
  let retryCount = 0;
  const maxRetries = 5;

  function registerButtonComponents() {
    if (typeof CMS === "undefined") {
      // If CMS is not available yet, try again in a moment (up to maxRetries times)
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(registerButtonComponents, 100);
      } else {
        console.warn(
          "Button components: CMS not available after",
          maxRetries,
          "retries. Component registration failed."
        );
      }
      return;
    }

    // GitHub Button Component
    CMS.registerEditorComponent({
      id: "github-button",
      label: "Button - GitHub",
      fields: [
        {
          name: "url",
          label: "GitHub URL",
          widget: "string",
          required: true,
        },
        {
          name: "text",
          label: "Button Text",
          widget: "string",
          default: "View Source Code",
          required: false,
        },
      ],
      pattern: /{{<\s*github-button\s+([\s\S]*?)\s*>}}/m,
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

        return `{{< github-button ${attributes} \n>}}`;
      },
      toPreview: function (data) {
        return `
<button style="background: #24292e; color: white; padding: 8px 16px; border: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px;">
  <span>🐙</span>
  <span>${data.text || "View Source Code"}</span>
</button>
`;
      },
    });

    // Website Button Component
    CMS.registerEditorComponent({
      id: "website-button",
      label: "Button - Website",
      fields: [
        {
          name: "url",
          label: "Website URL",
          widget: "string",
          required: true,
        },
        {
          name: "text",
          label: "Button Text",
          widget: "string",
          default: "Visit the Website",
          required: false,
        },
      ],
      pattern: /{{<\s*website-button\s+([\s\S]*?)\s*>}}/m,
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

        return `{{< website-button ${attributes} \n>}}`;
      },
      toPreview: function (data) {
        return `
<button style="background: #1e90ff; color: white; padding: 8px 16px; border: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px;">
  <span>🌐</span>
  <span>${data.text || "Visit the Website"}</span>
</button>
`;
      },
    });

    // Download Button Component
    CMS.registerEditorComponent({
      id: "download-button",
      label: "Button - Download",
      fields: [
        {
          name: "url",
          label: "Download URL",
          widget: "string",
          required: true,
        },
        {
          name: "text",
          label: "Button Text",
          widget: "string",
          default: "Download",
          required: false,
        },
        {
          name: "ext",
          label: "File Extension",
          widget: "select",
          options: [
            { label: "Generic", value: "generic" },
            { label: "Windows (.exe)", value: "exe" },
            { label: "Java (.jar)", value: "jar" },
          ],
          default: "generic",
          required: false,
        },
      ],
      pattern: /{{<\s*download-button\s+([\s\S]*?)\s*>}}/m,
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

        return `{{< download-button ${attributes} \n>}}`;
      },
      toPreview: function (data) {
        const ext = data.ext || "generic";
        let icon = "⬇️";
        let bgColor = "#607d8b";

        if (ext === "exe") {
          icon = "🪟";
          bgColor = "#0078d7";
        } else if (ext === "jar") {
          icon = "☕";
          bgColor = "#f89820";
        }

        return `
<button style="background: ${bgColor}; color: white; padding: 8px 16px; border: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px;">
  <span>${icon}</span>
  <span>${data.text || "Download"}</span>
</button>
`;
      },
    });

    // Amazon Button Component
    CMS.registerEditorComponent({
      id: "amazon-button",
      label: "Button - Amazon",
      fields: [
        {
          name: "url",
          label: "Amazon URL",
          widget: "string",
          required: true,
        },
        {
          name: "text",
          label: "Button Text",
          widget: "string",
          default: "Amazon App Store",
          required: false,
        },
      ],
      pattern: /{{<\s*amazon-button\s+([\s\S]*?)\s*>}}/m,
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

        return `{{< amazon-button ${attributes} \n>}}`;
      },
      toPreview: function (data) {
        return `
<button style="background: #ff9900; color: #232f3e; padding: 8px 16px; border: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px;">
  <span>📦</span>
  <span>${data.text || "Amazon App Store"}</span>
</button>
`;
      },
    });

    // Google Play Button Component
    CMS.registerEditorComponent({
      id: "googleplay-button",
      label: "Button - Google Play",
      fields: [
        {
          name: "url",
          label: "Google Play URL",
          widget: "string",
          required: true,
        },
        {
          name: "text",
          label: "Button Text",
          widget: "string",
          default: "Google Play Store",
          required: false,
        },
      ],
      pattern: /{{<\s*googleplay-button\s+([\s\S]*?)\s*>}}/m,
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

        return `{{< googleplay-button ${attributes} \n>}}`;
      },
      toPreview: function (data) {
        return `
<button style="background: #34a853; color: white; padding: 8px 16px; border: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px;">
  <span>▶️</span>
  <span>${data.text || "Google Play Store"}</span>
</button>
`;
      },
    });

    // Resume Button Component
    CMS.registerEditorComponent({
      id: "resume-button",
      label: "Button - Resume",
      fields: [
        {
          name: "url",
          label: "Resume PDF URL",
          widget: "string",
          required: true,
        },
        {
          name: "text",
          label: "Button Text",
          widget: "string",
          default: "Download Resume",
          required: false,
        },
        {
          name: "type",
          label: "Resume Type",
          widget: "select",
          options: [
            { label: "Software", value: "software" },
            { label: "Robotics", value: "robotics" },
            { label: "Acting", value: "acting" },
          ],
          default: "software",
          required: false,
        },
      ],
      pattern: /{{<\s*resume-button\s+([\s\S]*?)\s*>}}/m,
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

        return `{{< resume-button ${attributes} \n>}}`;
      },
      toPreview: function (data) {
        const type = data.type || "software";
        let bgColor = "#2c3e50";

        if (type === "robotics") {
          bgColor = "#e74c3c";
        } else if (type === "acting") {
          bgColor = "#9b59b6";
        }

        return `
<button style="background: ${bgColor}; color: white; padding: 8px 16px; border: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px;">
  <span>📄</span>
  <span>${data.text || "Download Resume"}</span>
</button>
`;
      },
    });

    // GGJ Button Component
    CMS.registerEditorComponent({
      id: "ggj-button",
      label: "GGJ Button",
      fields: [
        { name: "url", label: "Submission URL", widget: "string" },
        { name: "hearts", label: "Heart Count", widget: "number", required: false },
      ],
      pattern: /{{<\s*ggj-button\s+url="([^"]+)"(?:\s+hearts="(\d+)")?\s*>}}/,
      fromBlock: function(match) {
        return {
          url: match[1],
          hearts: match[2] ? parseInt(match[2], 10) : undefined,
        };
      },
      toBlock: function(obj) {
        let block = `{{< ggj-button url="${obj.url}"`;
        if (obj.hearts !== undefined && obj.hearts !== "") {
          block += ` hearts="${obj.hearts}"`;
        }
        block += " >}}";
        return block;
      },
      toPreview: function(obj) {
        return `
<button style="background: linear-gradient(135deg, #a259ff 0%, #f24e9c 100%); color: white; padding: 8px 16px; border: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 17px;">
  <span>🕹️</span>
  <span>Global Game Jam</span>
  ${obj.hearts ? `<span style='margin-left: 0.7em; font-weight: 700; color: #222; text-shadow: 0 1px 4px #fff, 0 0 2px #fff; display: inline-block;'><span style='color: #ff3366; margin-right: 0.2em;'>❤️</span>${obj.hearts}</span>` : ''}
</button>
`;
      },
    });
  }

  // Start the registration process
  registerButtonComponents();
})();
