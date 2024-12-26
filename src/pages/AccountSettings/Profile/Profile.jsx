import React, { useEffect, useState } from 'react';
import { Button } from '@/componentss/ui/button';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Dropdown } from '@/componentss/ui/dropdown';

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader
} from '@/componentss/ui/card';

import Avatar1 from '../../../assets/users/user-1.png';
import { COLORS, colors } from '../../../common/constants/styles';
import { useDispatch } from 'react-redux';
import { updateTableRecord } from '../../../redux/slices/tableSlice';
import {
  getLoggedInUser,
  updateProfile
} from '../../../redux/slices/authSlice';
import SelectField from '../../../elements/SelectField';
import { fetchOptionByfieldName } from '../../../services/table';
import { updateFormData } from '../../../redux/slices/formSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';

// ==============================|| PROFILE 3 - PROFILE ||============================== //

const Profile = ({ userDetail, getUserData }) => {
  console.log(userDetail);
  const dispatch = useDispatch();
  const [currentUserDetail, setCurrentUserDetail] = useState();
  const { currentUser } = useSelector((state) => state.auth);
  const [theamOption, setTheamOption] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState();

  useEffect(() => {
    if (currentUser) {
      setCurrentUserDetail(currentUser);
    }
  }, [currentUser]);
  const [initialValues, setInitialValues] = useState({
    user_name: '',
    user_email: '',
    company: 'Materially Inc.',
    country: 'INDIA',
    mobile: '',
    department: '',
    address: '',
    department: ''
    // submit: null
  });

  const fetchOption = async () => {
    const result = await fetchOptionByfieldName('system_user', 'theme');
    if (result.statusCode === 200) {
      const optionsWithColors = result.result.map((option: any) => {
        let color = '#000'; // Default color
        switch (option.label) {
          case 'Ocean':
            color = '#2463eb'; // Gold
            break;
          case 'Forest':
            color = '#0b8636'; // Indigo
            break;
          case 'Ruby':
            color = '#e11d47'; // Dodger Blue
            break;
            case 'Solar':
            color = '#e9c368'; // Dodger Blue
            break;
          default:
            color = '#808080'; // Grey for unspecified
            break;
        }
        return { ...option, color }; // Add the color property
      });
      setTheamOption(optionsWithColors);
    }
  };

  useEffect(() => {
    fetchOption();
    dispatch(getLoggedInUser());
  }, []);

  useEffect(() => {
    if (userDetail) {
      setInitialValues({
        user_name: userDetail?.user_name
          ? userDetail?.user_name
          : currentUser?.username?.split('@')[0],
        user_email: userDetail?.user_email
          ? userDetail?.user_email
          : currentUser?.username,
        company: 'Materially Inc.',
        country: 'INDIA',
        mobile: userDetail?.mobile || '',
        department: userDetail?.department || '',
        address: userDetail?.address || '',
        theme:userDetail?.theme || ''
        // submit: null
      });
      const mode=localStorage.getItem('mode')  || userDetail.theme;
      console.log(mode,"modexxx")
      const themeMode = mode;
      const themes = ['default', 'forest', 'ruby', 'solar', 'ocean'];
      document.documentElement.className = themes[themeMode - 1] || 'default';
    }
  }, [userDetail]);

  const handleChangeTheam = async (e) => {
    const newObj = {
      uuid: currentUserDetail?.userUUID,
      theme: e.target.value || localStorage.getItem('mode')
    };
    const themeMode =  e.target.value;
    const themes = ['default', 'forest', 'ruby', 'solar', 'ocean'];
    document.documentElement.className = themes[themeMode - 1] || 'default';
    localStorage.setItem('mode', themeMode);
    const result = await dispatch(
      updateFormData({
        formname: 'system_user',
        data: newObj 
      })
    );
    if (result.payload.statusCode === 200) {
      const copyObj = Object.assign({}, currentUserDetail);
      copyObj.theme = e.target.value;
      setCurrentUserDetail(copyObj);
      dispatch(getLoggedInUser());
    }
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        user_name: Yup.string().max(50).required('Name is required'),
        user_email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        department: Yup.string().max(100),
        address: Yup.string().max(255),
        company: Yup.string().max(255).required('Company is required'),
        country: Yup.string().max(50).required('Country is required'),
        mobile: Yup.string().min(10).required('Mobile number is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const data = values;
          const result = await dispatch(updateProfile(data));
          if (result) {
            getUserData();
          }
          setStatus({ success: true });
          setSubmitting(false);
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => {
        return (
          <form noValidate onSubmit={handleSubmit}>
            <div className="mx-auto">
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-4">
                  <Card className="">
                    <CardHeader>
                      <CardTitle className="border-b-2 pb-2 text-lg font-medium">
                        Profile Picture
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={Avatar1} alt="Profile" />
                        <AvatarFallback>NS</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">
                        Upload/Change Your Profile Image
                      </p>
                      <Button>Upload Avatar</Button>
                    </CardContent>
                  </Card>
                  <Card className="mt-4 min-h-52">
                    <CardHeader>
                      <CardTitle className="border-b-2 pb-2 text-lg font-medium">
                        Change theme Color
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex flex-col items-start space-y-4">
                      <div className="">
                        <Dropdown
                          label="Theme"
                          type="text"
                          value={userDetail?.theme ? userDetail?.theme : ''}
                          onChange={(e) => handleChangeTheam(e)}
                          options={theamOption.map((option) => ({
                            ...option,
                            label: (
                              <span className="flex items-center">
                                <span
                                  style={{
                                    backgroundColor: option.color,
                                    borderRadius: '50%',
                                    width: '10px',
                                    height: '10px',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                  }}
                                ></span>
                                {option.label}
                              </span>
                            ),
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="border-b-2 pb-2 text-lg font-medium">
                        Edit Account Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2">
                        <Input
                          label="Name"
                          name="user_name"
                          value={values.user_name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.user_name && errors.user_name)}
                          helperText={touched.user_name && errors.user_name}
                        />
                      </div>
                      <div className="mt-2">
                        <Input
                          label="Email address"
                          name="user_email"
                          disabled
                          value={values.user_email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(
                            touched.user_email && errors.user_email
                          )}
                          helperText={touched.user_email && errors.user_email}
                        />
                      </div>
                      <div className="mt-2 grid gap-4 md:grid-cols-2">
                        <Input
                          label="Company"
                          name="company"
                          value={values.company}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.company && errors.company)}
                          helperText={touched.company && errors.company}
                        />

                        <Input
                          label="Department"
                          name="department"
                          value={values.department}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(
                            touched.department && errors.department
                          )}
                          helperText={touched.department && errors.department}
                        />
                      </div>
                      <div className="mt-2">
                        <Input
                          label="Address"
                          name="address"
                          value={values.address}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </div>
                      <div className="mt-2 grid gap-4 md:grid-cols-2">
                        <Input
                          id="mobile"
                          fullWidth
                          label="Mobile"
                          type="number"
                          name="mobile"
                          value={values.mobile}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          onInput={(e) =>
                            (e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 10))
                          }
                          error={Boolean(touched.mobile && errors.mobile)}
                          helperText={touched.mobile && errors.mobile}
                        />

                        <Input
                          id="country"
                          label="Country"
                          name="country"
                          value={values.country}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.country && errors.country)}
                          helperText={touched.country && errors.country}
                        />
                      </div>

                      {errors.submit && (
                        <div item xs={12}>
                          <Label>{errors.submit}</Label>
                        </div>
                      )}
                      <div className="mt-4">
                        <Button
                          type="submit"
                          // onClick={updateProfile}
                          disabled={isSubmitting}
                        >
                          Update
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default Profile;
