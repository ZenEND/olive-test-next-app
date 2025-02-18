import {InfectionLog} from "@/interfaces/InfectionLog";
import {axiosInstance} from "@/api/instance";

export interface InfectionsSearchResponse {
  data: InfectionLog[];
  credits_left: number;
  items_count: number;
  next: string;
  search_consumed_credits: number;
  search_id: string;
  total_items_count: number;
}

export interface ErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}

export interface ErrorResponse {
  error_message: string;
  request_id: string;
  details: ErrorDetail[];
}

export const searchInfections = (requestBody: Record<string, string | string[] | number>) => axiosInstance.post<InfectionsSearchResponse>(`infections/_search`, requestBody);