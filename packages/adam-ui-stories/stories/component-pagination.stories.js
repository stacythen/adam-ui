/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React from "react";

import { storiesOf } from "@storybook/react";

import Pagination from "adam-component-pagination";

storiesOf("Pagination", module)
  .add("default", () => <Pagination pageSize={5} currentPage={2} rowCount={100} />);
