import { Footprints, Mail, ServerCog } from 'lucide-react';
import { Globe } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Users } from 'lucide-react';
import { Sync } from 'lucide-react';
const style = {
  fontSize: 'inherit',
  color: 'inherit'
};
export const IconForOption = {
  email: <Mail sx={style} />,

  phone: <Phone sx={style} />,

  walkIn: <Footprints sx={style} />,

  web: <Globe sx={style} />,

  API: <ServerCog sx={style} />,

  social: <Users sx={style} />
};
