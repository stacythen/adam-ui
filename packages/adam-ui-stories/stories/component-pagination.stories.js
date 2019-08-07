/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React from "react";

import { storiesOf } from "@storybook/react";

import Pagination from "adam-component-pagination";

storiesOf("Pagination", module)
  .add("default", () => <Pagination pageSize={10} currentPage={1} rowCount={10} />);
