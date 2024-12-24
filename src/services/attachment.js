import makeHttpCall from '../axios';

export const uploadAttachment = (formName, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return makeHttpCall({
    method: 'POST',
    url: `/attachment/form/${formName}/upload`,
    data: formData
  });
};

export const uploadAttachments = (formName, files, recordId) => {
  const formData = new FormData();
  if (files) {
    for (const file of files) {
      formData.append('files', file);
    }
  }

  return makeHttpCall({
    method: 'POST',
    url: `/attachment/form/${formName}/uploads?recordId=${
      recordId ? recordId : ''
    }`,

    data: formData
  });
};

export const downloadAttachment = async (tableName, columnName, attachment) => {
  try {
    let attachmentData = attachment
      ? JSON.parse(JSON.stringify(attachment))
      : null;
    const response = await makeHttpCall({
      method: 'GET',
      url: `/table/${tableName}/${columnName}/attachment/s3/${attachment?.attachmentId}`,
      responseType: 'arraybuffer'
    });
    if (!response) {
      throw new Error('Invalid response data');
    }
    if (attachmentData && !attachmentData?.fileContentType) {
      attachmentData['fileExtension'] = attachmentData?.fileExtension
        ? attachmentData?.fileExtension.toLowerCase()
        : attachmentData.fileName.split('.').pop().toLowerCase();
      switch (attachmentData['fileExtension']) {
        case 'pdf':
          attachmentData['fileContentType'] = 'application/pdf';
          break;
        case 'xls':
          attachmentData['fileContentType'] = 'application/vnd.ms-excel';
          break;
        case 'xlsx':
          attachmentData['fileContentType'] =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'doc':
        case 'docs':
          attachmentData['fileContentType'] =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'txt':
          attachmentData['fileContentType'] = 'text/plain';
          break;
        case 'png':
          attachmentData['fileContentType'] = 'image/png';
          break;
        case 'jpg':
        case 'jpeg':
          attachmentData['fileContentType'] = 'image/jpg';
          break;
        case 'csv':
          attachmentData['fileContentType'] = 'text/csv';
          break;
        default:
          attachmentData['fileContentType'] = 'application/octet-stream';
          break;
      }
    }
    const blob = new Blob([response], {
      type: attachment?.fileContentType
    });
    if (!blob.size || blob.type === 'application/octet-stream') {
      throw new Error('Unsupported file format');
    }
    const objectURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = objectURL;
    downloadLink.download = attachment?.fileName || 'downloaded_file';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(objectURL);
    return 'Attachment Download: Success';
  } catch (e) {
    console.error(e);
    throw new Error('Attachment Download: Failed');
  }
};

export const previewAttachment = async (formName, attachment) => {
  try {
    let attachmentData = attachment
      ? JSON.parse(JSON.stringify(attachment))
      : null;
    const blobResponse = await makeHttpCall({
      method: 'GET',
      url: `/attachment/form/${formName}/${attachment}`,
      responseType: 'arraybuffer'
    }).then((response) => {
      if (!response) {
        throw new Error('Invalid response data');
      }
      if (attachmentData && !attachmentData?.fileContentType) {
        attachmentData['fileExtension'] = attachmentData?.fileExtension
          ? attachmentData?.fileExtension.toLowerCase()
          : attachmentData.fileName.split('.').pop().toLowerCase();
        switch (attachmentData['fileExtension']) {
          case 'pdf':
            attachmentData['fileContentType'] = 'application/pdf';
            break;
          case 'xls':
            attachmentData['fileContentType'] = 'application/vnd.ms-excel';
            break;
          case 'xlsx':
            attachmentData['fileContentType'] =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
          case 'doc':
          case 'docs':
            attachmentData['fileContentType'] =
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
          case 'txt':
            attachmentData['fileContentType'] = 'text/plain';
            break;
          case 'png':
            attachmentData['fileContentType'] = 'image/png';
            break;
          case 'jpg':
          case 'jpeg':
            attachmentData['fileContentType'] = 'image/jpg';
            break;
          case 'csv':
            attachmentData['fileContentType'] = 'text/csv';
            break;
          default:
            attachmentData['fileContentType'] = 'application/octet-stream';
            break;
        }
      }
      const blob = new Blob([response], {
        type: attachmentData?.fileContentType
      });
      const fileUrl = URL.createObjectURL(blob);
      return fileUrl;
    });
    return { ...{ blobUrl: blobResponse, status: true }, ...attachmentData };
  } catch (e) {
    console.error(e);
    throw new Error('Attachment Download: Failed');
  }
};
export const downloadJsonAttachment = async (formName, attachment) => {
  return makeHttpCall({
    method: 'GET',
    url: `/attachment/form/${formName}/${attachment}`,
    responseType: 'arraybuffer'
  });
};

export const deleteAttachment = (formName, attachment) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/attachment/form/${formName}/${attachment?.attachmentId}`
  });
};

export const fetchAttachments = async (formName, recordId) => {
  const refURL = `/attachment/form/${formName}/fetch`;

  const response = await makeHttpCall({
    method: 'POST',
    url: refURL,
    data: {
      recordId
    }
  });

  if (!response.result) {
    return [];
  }

  return response.result;
};

export const fetchAttachmentCatalogList = async (formName, recordId) => {
  const refURL = `/attachment/form/${formName}/fetch`;
  const response = await makeHttpCall({
    method: 'POST',
    url: refURL,
    data: {
      recordId: recordId
    }
  });

  if (!response.result) {
    return [];
  }

  return response.result;
};

export const getAttachmentPreviewUrl = async (
  tableName,
  columnName,
  attachment
) => {
  try {
    const response = await makeHttpCall({
      method: 'GET',
      url: `/table/${tableName}/${columnName}/attachment/${attachment?.attachmentId}`
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get attachment preview URL');
  }
};

export const fetchAttachmentCount = (formName, recordId) => {
  return makeHttpCall({
    method: 'POST',
    url: `/attachment/form/${formName}/count`,
    data: {
      recordId: recordId
    }
  });
};

// export const fetchIndivualAttachmentCountValues = (fieldInfoId, data) =>
//   makeHttpCall({
//     method: 'POST',
//     url: `/field/${fieldInfoId}/attachment/count`,
//     data
//   });
