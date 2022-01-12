import {
  Flex,
  Box,
  Text,
  Heading,
  Button,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import {
  useOverviewQuery,
  OverviewQuery,
  useUserQuery,
  useDeleteFeedItemMutation,
} from "../../generated/graphql";
import { Head } from "../Head";
import { useError } from "../../util/hooks/useError";
import { usePagination } from "../../util/hooks/usePagination";
import { SmallCard } from "../SmallCard";

/************** PROPS *************/
interface FeedProps {
  id: number;
}

/************** COMPONENTS *************/
const Feed: React.FC<FeedProps> = ({ id }) => {
  /************** SETUP *************/
  const [cursor, setCursor] = React.useState<string>("");
  const loader = React.useRef<HTMLDivElement>(null);

  const [deleteItem] = useDeleteFeedItemMutation();
  const { data, fetchMore } = useOverviewQuery({ variables: { limit: 8 } });

  /************** HOOKS *************/
  useError<OverviewQuery>(data, "getUserOverview", "/login"); // handle any errors

  // Fetches any new data from websocket
  const { loading } = usePagination(
    { cursor, limit: 8 },
    loader,
    fetchMore,
    cursor
  );

  /**
   * Set pagination cursor
   */
  React.useEffect(() => {
    if (
      data &&
      data.getUserOverview.response &&
      data.getUserOverview.response.feed.length > 0
    )
      setCursor(
        data.getUserOverview.response.feed[
          data.getUserOverview.response.feed.length - 1
        ].createdAt
      );
  }, [data]);

  /************* HANDLERS **************/
  /**
   * Send a delete request to Server
   * @param id the ID of the Feed being deleted
   * @param cursor the pagination cursor
   */
  const onClick = async (id: number, cursor: string) => {
    await deleteItem({
      variables: {
        id,
        cursor,
      },
      update: (cache, { data: deletedData }) => {
        if (!deletedData) return; // if null or undefined, return

        const deletedItem = cache.identify({
          id,
          __typename: "Feed",
        });
        cache.evict({ id: deletedItem });
      },
    });
  };

  /************* RENDER **************/
  return data && data.getUserOverview.response ? (
    data.getUserOverview.response.feed.length > 0 ? (
      <React.Fragment>
        <Stack align="center" spacing={4}>
          {data.getUserOverview.response.feed.map((feed) => (
            <Box
              key={feed.id}
              p={4}
              background="#F8F9FA"
              borderBottom="1px solid rgba(0,0,0,0.05)"
              w="100%">
              <Flex align="center">
                <Button
                  background="transparent"
                  color="#7209B7"
                  size="xs"
                  rounded="50%"
                  onClick={() =>
                    onClick(
                      feed.id,
                      data.getUserOverview!.response!.feed[
                        data.getUserOverview!.response!.feed.length - 1
                      ].createdAt
                    )
                  }
                  mr={4}>
                  x
                </Button>
                <Box flex={2} minW={0}>
                  <Heading size="sm">{feed.title}</Heading>
                  <Flex align="center">
                    {feed.subheading && (
                      <Text whiteSpace="nowrap">{feed.subheading}</Text>
                    )}
                    {feed.desc && (
                      <Text isTruncated ml={2} opacity={0.7}>
                        {feed.desc}
                      </Text>
                    )}
                  </Flex>
                </Box>
                <Text style={{ fontSize: "12px" }}>
                  {new Date(feed.createdAt).toLocaleString()}
                </Text>
              </Flex>
            </Box>
          ))}
        </Stack>
        {data &&
          data.getUserOverview.response &&
          !!data.getUserOverview.hasMore && (
            <Flex ref={loader} align="center" justify="center">
              {loading && <Spinner />}
            </Flex>
          )}
      </React.Fragment>
    ) : (
      <Flex align="center" justify="center">
        <Text fontFamily="Poppins">Your feed is empty.</Text>
      </Flex>
    )
  ) : null;
};

/**
 * Component that displays metrics given the data
 */
const Metrics: React.FC<FeedProps> = ({ id }) => {
  /************* SETUP **************/
  const { data } = useOverviewQuery({ fetchPolicy: "cache-only" });

  /************* RENDER **************/
  return (
    <React.Fragment>
      {data && data.getUserOverview.response && (
        <Flex
          flex={1}
          gridGap={8}
          mb={8}
          justify="center"
          flexDir={{ base: "column", lg: "row" }}>
          <SmallCard
            heading="Projects"
            value={data.getUserOverview.response.projects}
          />
          <SmallCard
            heading="Owned Projects"
            value={data.getUserOverview.response.owned}
          />
          <SmallCard
            value={data.getUserOverview.response.created}
            heading="Issues Created"
          />
          <SmallCard
            value={data.getUserOverview.response.posted}
            heading="Comments Posted"
          />
        </Flex>
      )}
    </React.Fragment>
  );
};

export const HomePage: React.FC = () => {
  const { data } = useUserQuery();

  return (
    <Flex p={8} flexDir="column" className="right-col">
      <Head name="Your Profile">
        <Text fontFamily="Poppins">
          Last updated {new Date(Date.now()).toDateString()}
        </Text>
      </Head>

      {/* Content */}
      <Box mt={8}>
        <Heading mb={6} size="sm">
          Metrics
        </Heading>
        {data && data.user && <Metrics id={data.user.id} />}

        <Heading mb={6} size="sm">
          Feed
        </Heading>
        {data && data.user && <Feed id={data.user.id} />}
      </Box>
    </Flex>
  );
};
