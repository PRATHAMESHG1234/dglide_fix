export const AUTH_HEADERS = {
  "x-auth": process.env.REACT_APP_X_AUTHORIZATION,
  "Content-Type": "application/json",
};

const getApiEndpoint = () => {
  const hostName = window.location.hostname;
  if (hostName === "devui.dglide.com") {
    return "https://dev.dglide.com/api/v1";
  } else if (hostName === "devui1.dglide.com") {
    return "https://dev1.dglide.com/api/v1";
  } else {
    return "https://dev.dglide.com/api/v1";
  }
};

export const API_ENDPOINT = getApiEndpoint();

// export const API_ENDPOINT = "http://localhost:9090/api/v1";
// export const API_ENDPOINT = "http://3.133.98.126:9090/api/v1";
// export const API_ENDPOINT = "http://127.0.0.1:9090/api/v1";

//https://search-test3-opensearch-sgcxx7a4myj2yexce3tf6z7hea.aos.ap-south-1.on.aws/test11/_search
