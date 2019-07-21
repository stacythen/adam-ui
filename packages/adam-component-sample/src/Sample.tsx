import React from 'react';

interface ISample {
  /** properties description here */
  children: React.ReactNode;
}

/**
 * component description here
 */
const Sample = (props: ISample): React.ReactElement => {
  return <span>{props.children}</span>;
};

export default Sample;
