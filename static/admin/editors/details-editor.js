// Custom Editor Component for Details Shortcode
(function () {
  let retryCount = 0;
  const maxRetries = 5;

  function registerDetailsComponent() {
    if (typeof CMS === "undefined") {
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(registerDetailsComponent, 100);
      } else {
        console.warn(
          "Details component: CMS not available after",
          maxRetries,
          "retries. Component registration failed."
        );
      }
      return;
    }
    CMS.registerEditorComponent({
      id: "details",
      label: "Details (Collapsible)",
      fields: [
        {
          name: "summary",
          label: "Summary",
          widget: "string",
          required: true,
        },
        {
          name: "body",
          label: "Content",
          widget: "markdown",
          required: true,
        },
      ],
      pattern: /{{<\s*details(?:\s+"([^"]*)")?\s*>}([\s\S]*?){{<\s*\/details\s*>}}/m,
      fromBlock: function (match) {
        return {
          summary: match[1] ? match[1].trim() : "",
          body: match[2] ? match[2].trim() : "",
        };
      },
      toBlock: function (data) {
        return `{{< details "${data.summary}" >}}\n${data.body}\n{{< /details >}}`;
      },
      toPreview: function (data) {
        return `<details><summary>${data.summary}</summary><div>${data.body}</div></details>`;
      },
    });
  }

  registerDetailsComponent();
})();
