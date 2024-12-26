import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui

// third-party
import 'react-quill/dist/quill.snow.css';

import AttachmentTwoToneIcon from '@mui/icons-material/AttachmentTwoTone';

import moment from 'moment';
import avatarImage from '../assets/users/user-1.png';
import Avatar from '../elements/Avatars';
import { fetchAttachments } from '../services/attachment';
import { fetchFieldsWithValuesForReference } from '../services/field';
import AttachmentCard from './AttachmentCard';

// ==============================|| MAIL DETAILS ||============================== //

const MailDetails = ({
  data = {
    id: '#2Mail_Phoebe',
    subject: 'Zowkegma musime cat hepi om ozfes hururpak nabvi orvag evre.',
    isRead: false,
    important: true,
    starred: false,
    time: '2024-08-27T08:12:48.984Z',
    promotions: false,
    forums: false,
    attach: false,
    sent: false,
    draft: false,
    spam: false,
    trash: false,
    profile: {
      avatar: 'user-3.png',
      name: 'Alberta Arnold',
      email: 'fidu@company.com',
      to: 'roghah@company.com'
    },
    sender: {
      avatar: 'user-4.png',
      name: 'Frank Black',
      email: 're@company.com',
      to: 'poilohoh@company.com',
      about:
        'Guncodet pu kil becwumda fuhok ow du ko ag am petuw eg wuvewi sogimci.'
    },
    message:
      'We wasnuaza gebid vun das baci fidi suoma upimih fu ga ne. Accef efiotma wecwab onbawabe ico wucego fejki vepenit vicok bizkusem hajlaged riwneit goduze zic mibazun. Pemcuse joc onvu ozecudi jof cesupi rerat meefatu karpuanu tanpap fadgukfu va gibbaigi epumencec veloje zojosno omvi. Bigupu cilpiceh ovapafdit ireveom ugabidcin uh luthehugo fu zu fuavubal ora uluku wo do.',
    attachments: []
  },
  mailData,
  formId,
  uploadTab,
  selectedId,
  open
}) => {
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (formId) {
      setLoading(true);
      fetchFieldsWithValuesForReference(formId)
        .then((data) => {
          setFields(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching form fields:', error);
        });
    }
  }, [formId]);

  useEffect(() => {
    if (uploadTab && selectedId)
      fetchAttachments(uploadTab?.[0]?.lookup?.formName, selectedId).then(
        (res) => {
          setAttachments(res);
        }
      );
    if (attachments.length === 0) {
      setAttachments([]);
    }
  }, [selectedId, open]);

  const filteredFields = fields?.filter(
    (field) => field?.type === 'text' || field?.type === 'textarea'
  );
  const extractedValues = {};
  filteredFields?.forEach((field) => {
    const value = mailData[field.name];
    if (value !== undefined && value !== null) {
      extractedValues[field.name] = value;
    }
  });
  const valuesArray = Object.values(extractedValues);

  function findHtmlString(array) {
    const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;

    for (const element of array) {
      if (htmlTagPattern.test(element)) {
        return element;
      }
    }

    return null;
  }

  const stripHtmlTags = (html) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || '';
  };
  const plainTextDescription = stripHtmlTags(valuesArray[1]);
  function getTimeDifference(dateString, originalTimezone = 'UTC', names) {
    const targetTimezone = 'Asia/Kolkata';

    if (!moment(dateString, moment.ISO_8601, true).isValid()) {
      return null;
    }

    const givenTime = moment.tz(dateString, originalTimezone);
    const givenTimeInIST = givenTime.clone().tz(targetTimezone);
    const now = moment.tz(targetTimezone);

    const diffInMinutes = now.diff(givenTimeInIST, 'minutes');
    const diffInHours = now.diff(givenTimeInIST, 'hours');
    const diffInDays = now.diff(givenTimeInIST, 'days');
    const diffInMonths = now.diff(givenTimeInIST, 'months');
    const diffInYears = now.diff(givenTimeInIST, 'years');

    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInHours < 24) {
      return ` ${diffInHours === 1 ? `${diffInHours} hour ago` : `${diffInHours} hours ago`}`;
    } else if (diffInDays < 31) {
      return ` ${diffInDays === 1 ? `${diffInDays} day ago` : `${diffInHours} days ago`} `;
    } else if (diffInMonths < 12) {
      return ` ${diffInMonths ? `${diffInMonths}  month ago` : `${diffInHours} months ago`}`;
    } else {
      return ` ${diffInYears ? `${diffInYears}  year ago` : `${diffInHours} years ago`}`;
    }
  }

  let jsonString = mailData?.json?.replace(/=/g, ':');

  // Step 2: Add quotes around the keys and values
  jsonString = jsonString
    ?.replace(/(\w+):/g, '"$1":')
    ?.replace(/:\s*([^,}]+)/g, ': "$1"');

  const jsonObject = safeParseJSON(jsonString);

  function safeParseJSON(jsonString) {
    try {
      if (typeof jsonString === 'string') {
        return JSON.parse(jsonString);
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
    }

    return {};
  }

  // Access the values
  const fromEmail = jsonObject?.from;
  const toEmail = jsonObject?.to;
  return (
    <div className={`gray-50 h-[400px] overflow-y-scroll`}>
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="relative h-10 w-10">
            <div className="absolute left-0 top-0 h-full w-full rounded-full border-4 border-gray-200"></div>
            <div className="absolute left-0 top-0 h-full w-full animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="col-span-1">
                <div className={`flex items-center justify-between gap-${'0'}`}>
                  <div>
                    <div className={`flex items-center gap-${'8'}`}>
                      <Avatar
                        alt={data?.profile.name}
                        src={
                          data?.profile && data.profile.avatar && avatarImage
                        }
                        size={'sm'}
                      />
                      <div className="flex flex-col gap-2">
                        {toEmail && (
                          <p className="text-xs font-normal text-gray-700">
                            To: {toEmail || ''}
                          </p>
                        )}
                        {fromEmail && (
                          <p className="block text-xs font-normal text-secondary">
                            From: {fromEmail || ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-normal text-gray-600">
                      {getTimeDifference(mailData?.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pt-0">
            <div className="grid grid-cols-1 gap-6">
              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-6">
                  <div className="col-span-1">
                    <div className="flex items-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {valuesArray?.[0] || ''}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="grid grid-cols-1 gap-6">
                      <div
                        className="col-span-1"
                        style={{
                          '& > p': {
                            marginBottom: 0
                          }
                        }}
                      >
                        <p className="text-base leading-6 text-gray-900">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: findHtmlString(valuesArray)
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                  {data?.attachments && (
                    <div className="col-span-1">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="col-span-1">
                          <div className="flex items-center gap-2">
                            <AttachmentTwoToneIcon fontSize="small" />
                            <p className="text-sm font-medium text-gray-600">
                              {attachments && attachments?.length}{' '}
                            </p>
                            <p className="text-sm font-medium text-gray-600">
                              Attachments
                            </p>
                          </div>
                        </div>
                        {attachments.length > 0 && (
                          <div className="col-span-1 flex flex-wrap gap-2">
                            {attachments?.map((item, index) => (
                              <AttachmentCard
                                key={index}
                                title={item.fileName}
                                link={item?.fileUrl}
                                fileType={item?.fileExtension}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

MailDetails.propTypes = {
  data: PropTypes.object,
  handleUserDetails: PropTypes.func,
  handleStarredChange: PropTypes.func,
  handleImportantChange: PropTypes.func
};

export default MailDetails;
