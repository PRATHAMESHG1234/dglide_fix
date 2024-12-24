import axios from 'axios';
import { errorHandler, makeCommonAIRequest } from '../axios';
export const fetchAiRquest = (url, header, payload) => {
  return makeCommonAIRequest({
    method: 'POST',
    url: url,
    headers: header,
    data: payload
  });
};
// export const createAction = (data) => {
//     return makeHttpCall({
//       method: 'POST',
//       url: `/action`,
//       data
//     });
//   };
// export const makeCommonAIRequest = async (url, headers) => {
//   try {
//     const result = await axios.get(url, {
//       headers: {
//         'tenant-id': headers
//       }
//     });
//     if (result.data) {
//       return result.data;
//     }
//     return null;
//   } catch (err) {
//     console.error(err);
//     return errorHandler(err);
//   }
// };
