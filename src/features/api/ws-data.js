import { api } from '@/app/api';
import { applyMainStatus } from '@/features/api/apply-main';
import { setSocketData } from '@/features/status/slice';

export const scoreStepWSApi = api.injectEndpoints({
  endpoints: build => ({
    getDataStreaming: build.query({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        { url, step },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        const ws = new WebSocket(url);
        const timeout = 120000;
        let timer;
        try {
          await cacheDataLoaded;

          const flowUuid = getState().application.flow_uuid;

          timer = setInterval(() => {
            dispatch(applyMainStatus.endpoints.applyStatus.initiate({ uuid: flowUuid }, { forceRefetch: true }));
          }, timeout);

          const listener = event => {
            const data = JSON.parse(event.data);

            updateCachedData(draft => {
              draft.push(data);
              dispatch(setSocketData({ step, url, ...data }));
            });
            if (data.is_final) {
              clearInterval(timer);
              ws.close();
            }
          };

          ws.addEventListener('message', listener);
        } catch {
          return e => {
            console.log(e);
          };
        } finally {
          await cacheEntryRemoved;
          clearInterval(timer);
          ws.close();
        }
      }
    })
  })
});

export const { useGetDataStreamingQuery } = scoreStepWSApi;
