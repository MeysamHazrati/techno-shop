import { useInfiniteQuery } from "@tanstack/react-query";
import { getAll } from "../../axios/controllers/article";

const shouldRetry = ({ response }) => response.status !== 404;
const shouldRefetch = ({ state }) => state.error?.response?.status !== 404;

export default (categories, onlyPublished, onlyConfirmed, sort, length) => {
  const { isFetching, isError, data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["articles", { categories, onlyPublished, onlyConfirmed, sort }],
    queryFn: ({ pageParam }) => getAll(categories, onlyPublished, onlyConfirmed, sort, pageParam, length),
    initialPageParam: 1,
    getNextPageParam: ({ data }) => data.nextPage,
    retry: (failureCount, error) => shouldRetry(error) && failureCount < 2,
    refetchOnMount: shouldRefetch,
    refetchOnReconnect: shouldRefetch,
    refetchOnWindowFocus: shouldRefetch,
    select: ({ pages }) => ({ articles: pages.flatMap(({ data }) => data.articles), total: pages[pages.length - 1].data.total }),
  });

  return { isFetchingArticles: isFetching, isArticlesError: isError, articles: data?.articles, total: data?.total, hasArticlesNextPage: hasNextPage, fetchArticlesNextPage: fetchNextPage };
};