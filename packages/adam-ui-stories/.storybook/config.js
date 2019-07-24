import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/component-datagrid.stories');
}

configure(loadStories, module);
