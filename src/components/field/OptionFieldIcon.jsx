import { Footprints, Mail, Webhook } from 'lucide-react';
import { Globe } from 'lucide-react';
import { Walk } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Users } from 'lucide-react';
import { Sync } from 'lucide-react';
const style = {
  fontSize: 'inherit',
  color: 'inherit'
};
export const IconForOption = {
  email: <Mail style={style} />,

  phone: <Phone style={style} />,

  walkIn: <Footprints style={style} />,

  web: <Globe style={style} />,

  API: <Webhook style={style} />,

  social: <Users style={style} />
};
