// Custom Editor Component for Project Details Shortcode
// Wait for CMS to be available before registering the component
(function () {
  let retryCount = 0;
  const maxRetries = 5;

  function registerProjectDetailsComponent() {
    if (typeof CMS === "undefined") {
      // If CMS is not available yet, try again in a moment (up to maxRetries times)
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(registerProjectDetailsComponent, 100);
      } else {
        console.warn(
          "Project Details component: CMS not available after",
          maxRetries,
          "retries. Component registration failed."
        );
      }
      return;
    }
    CMS.registerEditorComponent({
      // Internal id of the component
      id: "project-details",
      // Visible label
      label: "Project Details",
      // Fields the user need to fill out when adding an instance of the component
      fields: [
        {
          name: "timeline",
          label: "Timeline",
          widget: "string",
          required: false,
        },
        {
          name: "languages",
          label: "Languages Used",
          widget: "string",
          required: false,
        },
        {
          name: "school",
          label: "School",
          widget: "string",
          required: false,
        },
        {
          name: "course",
          label: "Course",
          widget: "string",
          required: false,
        },
        {
          name: "client",
          label: "Client",
          widget: "string",
          required: false,
        },
        {
          name: "role",
          label: "Role",
          widget: "string",
          required: false,
        },
        {
          name: "employer",
          label: "Employer",
          widget: "string",
          required: false,
        },
        {
          name: "position",
          label: "Position",
          widget: "string",
          required: false,
        },
        {
          name: "software",
          label: "Software Used",
          widget: "string",
          required: false,
        },
        {
          name: "reason",
          label: "Reason",
          widget: "string",
          required: false,
        },
        {
          name: "race_distance",
          label: "Race Distance",
          widget: "string",
          required: false,
        },
        {
          name: "race_time",
          label: "Race Time",
          widget: "string",
          required: false,
        },
        {
          name: "top_speed",
          label: "Top Speed",
          widget: "string",
          required: false,
        },
      ],
      // Regex pattern used to search for instances of this block in the markdown document.
      // This pattern matches the Hugo shortcode syntax for project-details with multiline support
      pattern: /{{<\s*project-details\s*([\s\S]*?)\s*>}}/m,
      // Given a RegExp Match object, return an object with one property for each field defined in `fields`.
      fromBlock: function (match) {
        const attributes = match[1];
        const data = {};

        // Parse the attributes from the shortcode, handling newlines
        const attrRegex = /(\w+)="([^"]*)"/g;
        let attrMatch;

        while ((attrMatch = attrRegex.exec(attributes)) !== null) {
          const [, name, value] = attrMatch;
          data[name] = value;
        }

        return data;
      },
      // Given an object with one property for each field defined in `fields`,
      // return the string you wish to be inserted into your markdown.
      toBlock: function (data) {
        const attributes = Object.entries(data)
          .filter(([, value]) => value && value.trim() !== "")
          .map(([key, value]) => `\n  ${key}="${value}"`)
          .join(" ");

        return `{{< project-details ${attributes} \n>}}`;
      },
      // Preview output for this component
      toPreview: function (data) {
        const filledFields = Object.entries(data)
          .filter(([, value]) => value && value.trim() !== "")
          .map(
            ([key, value]) =>
              `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`
          )
          .join("");

        return `
<div class="project-details-card">
  <table>
    <tbody>
      ${filledFields}
    </tbody>
  </table>
</div>
`;
      },
    });
  }

  // Start the registration process
  registerProjectDetailsComponent();
})();
