import React from 'react';
import { Card, CardContent, CardHeader } from '@/componentss/ui/card';
import { Label } from '@/componentss/ui/label';
import { cn } from '@/lib/utils';

interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: React.CSSProperties;
  darkTitle?: boolean;
  secondary?: React.ReactNode;
  shadow?: string | number;
  sx?: React.CSSProperties & { className?: string }; // Added className to sx type
  title?: React.ReactNode;
}

const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = false,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        {...others}
        className={cn(
          border ? 'border-gray-300/98 border' : 'border-none',
          'shadow-none transition-shadow hover:shadow-md',
          sx.className
        )}
      >
        {/* card header and action */}
        {title && (
          <CardHeader className="flex w-full flex-row items-center justify-between text-lg">
            {darkTitle ? (
              <Label className="text-lg font-medium text-gray-900">
                {title}
              </Label>
            ) : (
              title
            )}
            {secondary}
          </CardHeader>
        )}

        {/* content & header divider */}
        {title && <div className="my-1~ h-px bg-gray-100" />}

        {/* card content */}
        {content ? (
          <CardContent className={cn(contentClass)} style={contentSX}>
            {children}
          </CardContent>
        ) : (
          children
        )}
      </Card>
    );
  }
);

MainCard.displayName = 'MainCard';

export default MainCard;
