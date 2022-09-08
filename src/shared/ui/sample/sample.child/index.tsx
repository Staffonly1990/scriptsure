import React, { FC } from 'react';

interface ISampleChildProps {
  description?: string;
}

const SampleChild: FC<ISampleChildProps> = ({ description }) => {
  return description ? <div>{description}</div> : null;
};
SampleChild.displayName = 'Sample.Child';

export default SampleChild;
