import { Label } from '@/componentss/ui/label';
import { Checkbox } from '@/componentss/ui/checkbox';
import { Button } from '@/componentss/ui/button';

// material-ui
import { FormControlLabel, FormGroup, Stack } from '@mui/material';
import SubCard from '../../../elements/SubCard';
import AnimateButton from '../../Login/AnimateButton';
import { colors } from '../../../common/constants/styles';
import { useSelector } from 'react-redux';
import { useState } from 'react';

// project imports

// ==============================|| PROFILE 3 - NOTIFICATIONS ||============================== //

const Notifications = () => {
  const { currentTheme } = useSelector((state) => state.auth);

  const [state1, setState1] = useState({
    checkedA: true,
    checkedB: true,
    checkedC: true,
    checkedD: false,
    checkedE: true,
    checkedF: false
  });
  const handleChangeState1 = (value, field) => {
    setState1({ ...state1, [field]: value });
  };
  const [state3, setState3] = useState({
    checkedA: true,
    checkedB: false
  });
  const handleChangeState3 = (value, field) => {
    setState3({ ...state3, [field]: value });
  };

  return (
    <div className="flex justify-evenly align-top">
      <div
        className={`p-4 shadow-sm ${
          currentTheme === 'Dark' ? 'bg-dark-level-1' : 'bg-white'
        } max-h-[400px] w-[58%] cursor-pointer rounded-lg transition-transform hover:outline hover:outline-1 hover:outline-secondary`}
      >
        <div>
          <div>
            <div>
              <div className="border-b-2 p-2">
                <Label className="text-lg font-semibold">
                  Subscription Preference Center
                </Label>
              </div>

              <div>
                <div className="mb-5 mt-3">
                  <Label className="text-lg font-medium text-gray-900">
                    I would like to receive:
                  </Label>
                </div>
                <div className="">
                  <div>
                    <div className="my-4 text-base">
                      <Checkbox
                        name="checkedA"
                        endLabel="Product Announcements and Updates"
                        checked={state1.checkedA}
                        onCheckedChange={async (checked) => {
                          handleChangeState1(checked, 'checkedA');
                        }}
                      />
                    </div>
                    <div className="my-4">
                      <Checkbox
                        name="checkedB"
                        endLabel="Events and Meetup"
                        checked={state1.checkedB}
                        onCheckedChange={async (checked) => {
                          handleChangeState1(checked, 'checkedB');
                        }}
                      />
                    </div>
                    <div className="my-4">
                      <Checkbox
                        name="checkedC"
                        endLabel="User Research Surveys"
                        checked={state1.checkedC}
                        onCheckedChange={async (checked) => {
                          handleChangeState1(checked, 'checkedC');
                        }}
                      />
                    </div>
                    <div className="my-4">
                      <Checkbox
                        name="checkedD"
                        endLabel="Hatch Startup Program"
                        checked={state1.checkedD}
                        onCheckedChange={async (checked) => {
                          handleChangeState1(checked, 'checkedD');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`p-4 shadow-sm ${
          currentTheme === 'Dark' ? 'bg-dark-level-1' : 'bg-white'
        } max-h-[400px] w-[38%] cursor-pointer rounded-lg transition-transform hover:outline hover:outline-1 hover:outline-secondary`}
      >
        <div>
          <div className="border-b-2 p-2">
            <Label className="text-lg font-semibold">Opt me out instead</Label>
          </div>
          <div>
            <div>
              <div>
                <div className="my-6">
                  <Checkbox
                    name="checkedA"
                    endLabel="Unsubscribe me from all of the above"
                    // checked={values.twoFactorAuthentication === '1'}
                    onCheckedChange={async (checked) => {
                      handleChangeState3(checked, 'checkedA');
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <Button>Update my preferences</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
