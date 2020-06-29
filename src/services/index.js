import { request } from "../utils";

export const getExample = payload =>
  request({
    url: `/api/get`,
    method: "get",
    params: payload
  });

export const postExample = payload =>
  request({
    url: `/api/post`,
    method: "post",
    data: payload
  });



