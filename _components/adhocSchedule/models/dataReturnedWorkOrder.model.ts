export const page = {
  total: 0,
  HasNextPage: false,
  HasPreviousPage: false,
  currentPage: 0,
  perPage: 0,
}

export default {
  data: [],
  meta: {
    page: {
      ...page
    },
  }
}