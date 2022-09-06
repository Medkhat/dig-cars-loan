import { api } from '@/app/api';

export const goalByClicks = api.injectEndpoints({
  endpoints: build => ({
    goalByClicks: build.query({
      query: ({ click_code, amount, iin, status, lead_uuid, goal_id }) => ({
        url: `https://track.cpamrkt.kz/track/goal-by-click-id?goal_id=${goal_id}&click_id=${click_code}&amount=${amount}&track_id=${iin}&adv_order_id=${lead_uuid}&conv_status=${status}`,
        method: 'GET'
      })
    })
  })
});

export const { useGoalByClicksQuery } = goalByClicks;
