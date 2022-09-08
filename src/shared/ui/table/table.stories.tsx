import React from 'react';
import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Table from './table';

export default {
  title: 'Shared/Table',
  component: Table,
  args: {
    sortable: false,
    pagination: false,
    onPaginationChange: action('onPaginationChange'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    data: { control: false },
    title: { control: false },
    columns: { control: false },
    sortable: { control: 'boolean' },
    pagination: { control: 'boolean' },
  },
  parameters: { controls: { hideNoControlsWarning: true } },
  decorators: [(Story) => <div className="flex items-start justify-start w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = ({ ...args }) => {
  return <Table {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  classes: {
    root: 'flex-auto sheet __border',
    container: 'sheet_container',
    table: 'sheet-table',
    thead: 'sheet-table_thead',
    row: 'sheet-table_row',
    column: 'sheet-table_column',
    columnSorted: '__sorted',
    pagination: 'sheet-pagination',
  },
  title: ({ rows }) => <p className="sheet-title">Results ({rows.length})</p>,
  columns: [
    {
      Header: 'name',
      accessor: 'name',
      classes: {
        header: 'sheet-table_header __name',
        cell: 'sheet-table_cell __text',
      },
    },
    {
      Header: 'age',
      accessor: 'age',
      classes: {
        header: 'sheet-table_header __name',
        cell: 'sheet-table_cell __text',
      },
    },
  ],
  data: [
    {
      _id: '61891bafd1eac90333034b93',
      index: 0,
      guid: 'f9f0a9b2-2cf6-4a63-9a4d-a93fd130960a',
      age: 21,
      name: 'Merrill Mcintosh',
    },
    {
      _id: '61891baf346f0cbcc792aba5',
      index: 1,
      guid: 'b2eb5d43-ced5-4588-a7bf-5f0f042ca235',
      age: 35,
      name: 'Gallegos Moss',
    },
    {
      _id: '61891baf4d7b335e57608c76',
      index: 2,
      guid: 'b3f7ff7a-375b-45db-ac88-420232935278',
      age: 29,
      name: 'Luann Swanson',
    },
    {
      _id: '61891bafa02df9b1a7f7a2a8',
      index: 3,
      guid: 'd84d2a9c-a1ca-43ff-b48d-eebe88870fcb',
      age: 22,
      name: 'Shaw Moses',
    },
    {
      _id: '61891baf6adf6cd95a7152e7',
      index: 4,
      guid: '942a2521-c486-4f64-a6de-7fa80cd47216',
      age: 36,
      name: 'Nanette Sheppard',
    },
    {
      _id: '61891baf4e06663683eb5bd3',
      index: 5,
      guid: '8e66ac12-3a71-480e-a72d-90e3fd271be9',
      age: 40,
      name: 'Casey Schmidt',
    },
  ],
};
