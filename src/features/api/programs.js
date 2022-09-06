import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

export const programs = api.injectEndpoints({
  endpoints: build => ({
    programs: build.query({
      query: code => ({ url: `${APIUrl}/programs/${code}/` }),
      transformResponse: response => response.data
    })
  })
});

export const { useProgramsQuery } = programs;
