import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

const applyAuth = api.injectEndpoints({
  endpoints: build => ({
    applyAuth: build.mutation({
      query: body => ({
        url: `${APIUrl}/apply-auth/`,
        method: 'POST',
        body
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useApplyAuthMutation } = applyAuth;

/* REQUEST *

  {
    "mobile_phone": "+77777732058",
  }

*/

/* RESPONSE *

  {
    "data": {},
    "error": null
  }

*/

export const applyAuthVerify = api.injectEndpoints({
  endpoints: build => ({
    verifyAuth: build.mutation({
      query: body => ({
        url: `${APIUrl}/apply-auth/verify/`,
        method: 'POST',
        body
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useVerifyAuthMutation } = applyAuthVerify;

/* REQUEST *

  {
    "mobile_phone": "+77777732058",
    "code": "1111"
  }

*/

/* RESPONSE *

  {
    "data": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQxOTYxMTM0LCJpYXQiOjE2NDE4NzQ3MzQsImp0aSI6ImQ0MWM1ZDkyNmQ4OTQ4YjJhZDI1MWY3N2I2ODAxYTM2IiwidXNlcl9pZCI6OCwidG9rZW4tc2VjcmV0IjoiY2ZmNWM2MzQtMThmOS00YjVmLWJjZmUtNDIxNTQxNmE4MTk1IiwibW9iaWxlX3Bob25lIjoiKzc3Nzc3NzMyMDU4IiwiZnVsbF9uYW1lIjoiXHUwNDEwXHUwNDIzXHUwNDIyXHUwNDFlXHUwNDEyIFx1MDQyMlx1MDQxNVx1MDQxZFx1MDQxOFx1MDQxN1x1MDQxMVx1MDQxMFx1MDQxOSBcdTA0MWRcdTA0MTBcdTA0MjBcdTA0MWNcdTA0MTBcdTA0MTNcdTA0MTBcdTA0MWNcdTA0MTFcdTA0MTVcdTA0MjJcdTA0MWVcdTA0MTJcdTA0MThcdTA0MjcifQ.rYI1-hBkBtKDGuCM6ueHn9uZHqlH39_QXmdyZeUrnTk",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY0MjQ3OTUzNCwiaWF0IjoxNjQxODc0NzM0LCJqdGkiOiI5NmI5ODA0YjEzNDk0YTM4ODc5NWVhMTA2MGNhOWI2YyIsInVzZXJfaWQiOjgsInRva2VuLXNlY3JldCI6ImNmZjVjNjM0LTE4ZjktNGI1Zi1iY2ZlLTQyMTU0MTZhODE5NSIsIm1vYmlsZV9waG9uZSI6Iis3Nzc3NzczMjA1OCIsImZ1bGxfbmFtZSI6Ilx1MDQxMFx1MDQyM1x1MDQyMlx1MDQxZVx1MDQxMiBcdTA0MjJcdTA0MTVcdTA0MWRcdTA0MThcdTA0MTdcdTA0MTFcdTA0MTBcdTA0MTkgXHUwNDFkXHUwNDEwXHUwNDIwXHUwNDFjXHUwNDEwXHUwNDEzXHUwNDEwXHUwNDFjXHUwNDExXHUwNDE1XHUwNDIyXHUwNDFlXHUwNDEyXHUwNDE4XHUwNDI3In0.35JgPCjpA0vrzYGx5XLv7GMzdOrVKRx47nfO0qQVJKs",
      "uuid": null
    },
    "error": null
  }

*/
