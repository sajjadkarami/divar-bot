export interface SearchRequest {
  city_ids: string[];
  pagination_data: PaginationData;
  disable_recommendation: boolean;
  map_state: MapState;
  search_data: SearchData;
}

export interface PaginationData {
  "@type": string;
  last_post_date: string;
  page: number;
  layer_page: number;
  search_uid: string;
}

export interface MapState {
  camera_info: CameraInfo;
}

export interface CameraInfo {
  bbox: Bbox;
}

export interface Bbox {}

export interface SearchData {
  form_data: FormData;
  server_payload: ServerPayload;
  query: string;
}

export interface FormData {
  data: Data;
}

export interface Data {
  category: Category;
  sort: Sort;
}

export interface Category {
  str: Str;
}

export interface Str {
  value: string;
}

export interface Sort {
  str: Str2;
}

export interface Str2 {
  value: string;
}

export interface ServerPayload {
  "@type": string;
  additional_form_data: AdditionalFormData;
}

export interface AdditionalFormData {}
