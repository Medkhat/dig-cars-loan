import { api } from '@/app/api';
import { APIUrl } from '@/app/API-Url';

const directoryRegions = api.injectEndpoints({
  endpoints: build => ({
    directoryRegions: build.query({
      query: () => ({
        url: `${APIUrl}/directory/cities/`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    })
  })
});

export const { useDirectoryRegionsQuery } = directoryRegions;

const directoryAutoCenters = api.injectEndpoints({
  endpoints: build => ({
    directoryAutoCenters: build.query({
      query: ({ region }) => ({
        url: `${APIUrl}/directory/cities/${region}/auto-centers`,
        method: 'GET'
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: response => response.data
    })
  })
});

export const { useDirectoryAutoCentersQuery } = directoryAutoCenters;
