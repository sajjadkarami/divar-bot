export interface WidgetList {
  list_widgets: Widget[];
}

export interface Widget {
  widget_type: string;
  data: Data;
  action_log: ActionLog;
}

export interface Data {
  "@type": string;
  title: string;
  action: Action;
  image_url: string;
  bottom_description_text: string;
  has_chat: boolean;
  middle_description_text: string;
  has_divider: boolean;
  image_count: number;
  top_description_text: string;
  token: string;
  should_indicate_seen_status: boolean;
}

export interface Action {
  type: string;
  payload: Payload;
}

export interface Payload {
  "@type": string;
  token: string;
  web_info: WebInfo;
}

export interface WebInfo {
  title: string;
  city_persian: string;
}

export interface ActionLog {
  server_side_info: ServerSideInfo;
  enabled: boolean;
}

export interface ServerSideInfo {
  info: Info;
  item_type: ItemType;
}

export interface Info {
  "@type": string;
  post_token: string;
  index: number;
  post_type: string;
  list_type: string;
  source_page: string;
  extra_data: ExtraData;
  sort_date: string;
}

export interface ExtraData {
  "@type": string;
  jli: Jli;
  last_post_sort_date: string;
  search_uid: string;
  search_data: SearchData;
}

export interface Jli {
  category: Category;
  query: string;
  sort: Sort;
  cities: string[];
}

export interface Category {
  value: string;
}

export interface Sort {
  value: string;
}

export interface SearchData {
  form_data_json: string;
  query: string;
  sort: string;
  server_payload_json: string;
  cities: string[];
  query_input_type: string;
}

export interface ItemType {
  type: string;
}
