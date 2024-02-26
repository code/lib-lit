import type {ComponentAnnotations, WebRenderer} from '@storybook/types';
import type {StoryObj} from '@storybook/web-components';

import {html, render} from 'lit';

import type {HelloWorld} from './hello-world.js';
import './hello-world.js';

interface PlainWebRenderer extends WebRenderer {
  component: string;
  storyResult: void;
}

type Meta<T> = ComponentAnnotations<PlainWebRenderer, T>;

// This is a typical Storybook story setup where there is a single render
// function that renders the component with the given args, and many declarative
// stories that just provide different args.
// For visual editing we _may_ want to have the stories have their own
// templates.
// In the future we would want to make this file simpler by defining utility\
// types in a @lit-labs/storybook package.
const meta: Meta<HelloWorld> = {
  title: 'Hello World',
  component: 'hello-world',
  render: ({name}, {canvasElement}) => {
    render(html`<hello-world .name=${name}></hello-world>`, canvasElement);
  },
};
export default meta;
// TODO (justinfagnani): dedupe the bounds definition wtih the one in
// component-story-format.js. We probably want our own storybaord package at
// some point.
type Story = StoryObj<HelloWorld> & {
  bounds?: {left: number; top: number; width: number; height: number};
};

export const storyOne: Story = {
  name: 'Story One',
  args: {name: 'One'},
};

export const storyTwo: Story = {
  name: 'Story Two',
  args: {name: 'Two'},
  bounds: {left: 60, top: 200, width: 200, height: 140},
};