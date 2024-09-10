declare module '*.scss';

// CSS Modules

declare module '*.m.sass' {
  const classes: Readonly<Record<string, string>>;

  export = classes;
}

declare module '*.m.scss' {
  const classes: Readonly<Record<string, string>>;

  export = classes;
}

// SVG Icons

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;

  export default ReactComponent;
}

// Images

declare module '*.avif' {
  const src: string;

  export default src;
}

declare module '*.bmp' {
  const src: string;

  export default src;
}

declare module '*.gif' {
  const src: string;

  export default src;
}

declare module '*.jpg' {
  const src: string;

  export default src;
}

declare module '*.jpeg' {
  const src: string;

  export default src;
}

declare module '*.png' {
  const src: string;

  export default src;
}

declare module '*.webp' {
  const src: string;

  export default src;
}
