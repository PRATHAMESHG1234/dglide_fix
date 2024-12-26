'use client';

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/componentss/ui/tabs';
import { Separator } from './separator';
import { ArrowLeft } from 'lucide-react';

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface CustomTabsProps {
  items: TabItem[];
  defaultValue?: string;
}

export function CustomTabs({ items, defaultValue }: CustomTabsProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultValue || items[0].value
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        {/* <ArrowLeft
          size={16}
          className="cursor-pointer"
          onClick={() => {
            setOpen(false);
            setpluginEdit({ type: '' });
          }}
        /> */}
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="px-4 py-2 text-sm font-medium"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <Separator className="mb-4 h-[0.15rem]" />
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
