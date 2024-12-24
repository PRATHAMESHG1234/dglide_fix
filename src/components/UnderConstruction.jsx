import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Label } from '@/componentss/ui/label';
import { Switch } from '@/componentss/ui/switch';
import { Progress } from '@/componentss/ui/progress';
import { Calendar } from '@/componentss/ui/calendar';
import { Loader2 } from 'lucide-react';
// import { Bar, BarChart } from 'recharts';

import { ChartConfig, ChartContainer } from '@/componentss/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Button } from '@/componentss/ui/button';
import { Input } from '@/componentss/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/componentss/ui/accordion';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/componentss/ui/sheet';
// material-ui
import { Home } from 'lucide-react';
import {
  // Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import imageDarkBackground from '../assets/maintenance/img-bg-grid-dark.svg';
import imageBackground from '../assets/maintenance/img-bg-grid.svg';
import imageParts from '../assets/maintenance/img-bg-parts.svg';
import image from '../assets/maintenance/img-build.svg';
import { colors } from '../common/constants/styles';
import AnimateButton from '../pages/Login/AnimateButton';
import { closeSidebar } from '../redux/slices/sidebarSlice';
import { notify } from '../hooks/toastUtils';

// styles
const CardMediaWrapper = styled('div')({
  maxWidth: 720,
  margin: '0 auto',
  position: 'relative'
});

const PageContentWrapper = styled('div')({
  maxWidth: 350,
  margin: '0 auto',
  textAlign: 'center'
});

const ConstructionCard = styled(Card)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const CardMediaBuild = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  animation: '5s bounce ease-in-out infinite'
});

const CardMediaParts = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  animation: '10s blink ease-in-out infinite'
});

// ========================|| UNDER CONSTRUCTION PAGE ||======================== //

const UnderConstruction = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(closeSidebar());
  }, []);

  const SHEET_SIDES = ['top', 'right', 'bottom', 'left'];

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 }
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb'
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa'
    }
  };

  return (
    // <ConstructionCard>
    //   <CardContent>
    //     <Grid container justifyContent="center" spacing={3}>
    //       <Grid item xs={12}>
    //         <CardMediaWrapper>
    //           <CardMedia
    //             component="img"
    //             image={
    //               theme.palette.mode === 'dark'
    //                 ? imageDarkBackground
    //                 : imageBackground
    //             }
    //             title="Slider 3 image"
    //           />
    //           <CardMediaParts src={imageParts} title="Slider 1 image" />
    //           <CardMediaBuild src={image} title="Slider 2 image" />
    //         </CardMediaWrapper>
    //       </Grid>
    //       <Grid item xs={12}>
    //         <PageContentWrapper>
    //           <Grid container spacing={3}>
    //             <Grid item xs={12}>
    //               <Typography
    //                 sx={{
    //                   fontSize: '2.125rem',
    //                   color: colors.grey[900],
    //                   fontWeight: 700
    //                 }}
    //                 component="div"
    //               >
    //                 Under Maintenance
    //               </Typography>
    //             </Grid>
    //             <Grid item xs={12}>
    //               <Typography
    //                 sx={{
    //                   letterSpacing: '0em',
    //                   fontWeight: 400,
    //                   lineHeight: '1.5em',
    //                   color: colors.grey[900]
    //                 }}
    //               >
    //                 This site is on under maintenance !! Please check after some
    //                 time
    //               </Typography>
    //             </Grid>
    //             <Grid item xs={12}>
    //               <AnimateButton>
    //                 <Button
    //                   variant="contained"
    //                   size="large"
    //                   component={Link}
    //                   to={'/login'}
    //                   sx={{
    //                     bgcolor: colors.primary.main,
    //                     textTransform: 'none',
    //                     transition: 'transform 0.3s',
    //                     '&:hover': {
    //                       bgcolor: colors.primary.main,
    //                       color: colors.white,
    //                       transform: 'scale(0.91)'
    //                     }
    //                   }}
    //                 >
    //                   <Home sx={{ fontSize: '1.3rem', mr: 0.75 }} />{' '}
    //                   Go to login page
    //                 </Button>
    //               </AnimateButton>
    //             </Grid>
    //           </Grid>
    //         </PageContentWrapper>
    //       </Grid>
    //     </Grid>
    //   </CardContent>
    // </ConstructionCard>
    <div className="flex justify-between gap-4">
      <div className="w-[50%] bg-white p-4">
        {/* switch */}
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>

        {/* progress */}

        <div className="mt-8">
          <Progress value={33} />
        </div>

        {/* calendar */}
        <div className="mt-8 w-72">
          <Calendar
            mode="single"
            selected={new Date()}
            // onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="mt-8 w-80">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Button */}

        <div className="mt-8 flex w-80 items-center justify-between gap-2">
          <Button variant="outline">Button</Button>
          <Button variant="secondary">Button</Button>
          <Button>Button</Button>
          <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        </div>

        {/* Dialog */}
        <div className="mt-8 w-72">
          <Label>Dialog </Label>
          <div className="grid grid-cols-2 gap-2">
            <Sheet key="right" open={false} className="sheet-satyam z-50">
              <SheetContent side="right">hello</SheetContent>
            </Sheet>
            {/* {SHEET_SIDES.map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <Button variant="outline">{side}</Button>
                </SheetTrigger>
                <SheetContent side={side}>
                  hello
                  {/* <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4  items-center    gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value="Pedro Duarte"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4  items-center    gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value="@peduarte"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Save changes</Button>
                    </SheetClose>
                  </SheetFooter> */}
          </div>
          <div className="mt-8 flex w-72 flex-col">
            <Input type="email" placeholder="Email" />
            <div className="mt-8 grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50%] bg-white p-4">
        <div className="mt-8">
          <Label> toast types</Label>
          <div className="mt-2 flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => notify.success('hi a sucess message')}
            >
              success
            </Button>
            <Button
              variant="outline"
              onClick={() => notify.warning('hi a warning message')}
            >
              warning
            </Button>
            <Button
              variant="outline"
              onClick={() => notify.error('hi a error message')}
            >
              error
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                It utilizes the "single" type, allowing only one item to be open
                at a time. You can click to open or close an item.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I customize it?</AccordionTrigger>
              <AccordionContent>
                Yes, you can style it as needed and even use custom icons for
                the trigger.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is it responsive?</AccordionTrigger>
              <AccordionContent>
                The component adapts well to different screen sizes, making it
                suitable for mobile and desktop views.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
