import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/component-datagrid.stories');
  require('../stories/component-pagination.stories');
}

configure(loadStories, module);
