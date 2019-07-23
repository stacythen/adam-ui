import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/component-sample.stories');
  require('../stories/component-datagrid.stories');
}

configure(loadStories, module);
