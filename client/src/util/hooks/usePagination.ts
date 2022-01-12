import React from "react";

export const usePagination = (
  variables: any,
  loader: React.RefObject<HTMLDivElement>,
  fetchMore: any,
  cursor: string
) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(async (entries) => {
      const first = entries[0];
      if (first.isIntersecting && first.intersectionRatio > 0 && !loading) {
        setLoading(true);
        await fetchMore({ variables });
        setLoading(false);
      }
    }, options);

    if (loader && loader.current) observer.observe(loader.current);

    const temp = loader.current;

    return () => {
      if (temp) observer.unobserve(temp);
      else observer.disconnect();
    };
  }, [fetchMore, loader, loading, variables]);

  return { loading };
};
