export interface IPaginationInfo {
  total_pages: number;
  pages: number;
  current_page: number;
  first_page: number;
  last_page: number;
  previous_page: number;
  next_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
  total_results: number;
  results: number;
  first_result: number;
  last_result: number;
}
