import React from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList
} from 'recharts';
import { PieChart, Pie, Label } from 'recharts';
import { LineChart, Line, Dot } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/componentss/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/componentss/ui/chart';
import { CircleX, TrendingUp } from 'lucide-react';
import { IndexKind } from 'typescript';
import { useSidebar } from '@/componentss/ui/sidebar';

const ChartCard = ({
  type,
  config,
  data,
  title,
  description,
  footerText,
  footerSubText,
  totalVisitors,
  formName,
  index,
  isDelete,
  onCrossClick,
  chartData
}) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart
            data={data}
            layout="vertical"
            accessibilityLayer
            margin={{ left: 0 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              fontSize={'8px'}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="value"
              layout="vertical"
              fill={config?.value?.color}
              radius={5}
            >
              <LabelList
                dataKey="label"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
                fontWeight={'600'}
                color={'#ffff'}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
              isAnimationActive={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-black text-3xl font-bold text-secondary"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {formName || 'visitors'}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        );

      case 'line':
        return (
          <LineChart data={data} margin={{ top: 24, left: 24, right: 24 }}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="value"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="value"
              type="natural"
              stroke={config?.value.color}
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.value}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill}
                    stroke={payload.fill}
                  />
                );
              }}
              activeDot={{
                r: 6
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="label"
                formatter={(value) => value}
              />
            </Line>
          </LineChart>
        );

      default:
        return null;
    }
  };
  const isLaptop = window.innerWidth >= 1024 && window.innerWidth <= 1440;
  const { open } = useSidebar();
  return (
    <div
      className={`${isLaptop && open ? 'w-[23.5rem]' : isLaptop && !open ? 'w-[28rem]' : 'w-[25rem]'} `}
      key={index}
    >
      <Card>
        {console.log(index, 'key')}
        <CardHeader className="relative">
          <CardTitle className="text-[#2d2d2d]">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {isDelete && (
            <div className="absolute right-1 top-1">
              <div
                className="rounded-md bg-background p-1 text-destructive hover:bg-destructive hover:text-white"
                onClick={() => onCrossClick(chartData?.dashboardItemInfoId)}
              >
                <CircleX size={18} className="cursor-pointer" />
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ChartContainer config={config}>{renderChart()}</ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {footerText} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {footerSubText}
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default ChartCard;
