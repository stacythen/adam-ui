import { configure } from "@storybook/react";

function loadStories() {
  require("../stories/component-sample.stories");
}

configure(loadStories, module);
