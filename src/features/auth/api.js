import { APIUrl } from '@/app/API-Url';
import { api } from '@/app/backAPI';

const auth = api.injectEndpoints({
  endpoints: build => ({
    auth: build.mutation({
      query: ({ username, password }) => ({ url: `${APIUrl}/auth/`, method: 'POST', body: { username, password } }),
      transformResponse: response => response.data,
      invalidatesTags: ['Auth']
    })
  })
});

export const { useAuthMutation } = auth;

const authRefresh = api.injectEndpoints({
  endpoints: build => ({
    authRefresh: build.mutation({
      query: ({ refresh }) => ({ url: `${APIUrl}/auth-refresh/`, method: 'POST', body: { refresh } }),
      transformResponse: response => response.data,
      invalidatesTags: ['Auth']
    })
  })
});

export const { useAuthRefreshMutation } = authRefresh;
