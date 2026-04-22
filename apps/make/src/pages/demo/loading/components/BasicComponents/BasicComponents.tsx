import React from 'react';

const hasCustomComponent = (children: React.ReactNode): boolean => {
  const childArray = React.Children.toArray(children);
  return childArray.some((child) => {
    if (React.isValidElement(child)) {
      const childType = child.type;
      let typeName = '';

      if (typeof childType === 'function') {
        typeName = childType.name || '';
      } else if (typeof childType === 'string') {
        typeName = childType;
      }

      const customTags = [
        'tamsamsom',
        'mermaid',
        'composedchartcomponent',
        'donutchartcomponent',
        'positioningmap'
      ];
      return customTags.some((tag) => typeName.toLowerCase().includes(tag));
    }
    return false;
  });
};

export const basicComponents = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => {
    if (hasCustomComponent(props.children)) {
      return <div style={{ display: 'contents' }}>{props.children}</div>;
    }
    return <p {...props} />;
  }
};
