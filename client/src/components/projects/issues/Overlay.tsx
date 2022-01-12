import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Stack,
  Heading,
  ModalCloseButton,
  Text,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import {
  useUserQuery,
  useCreateCommentMutation,
  SendCommentDocument,
  useCommentsQuery,
  UserIssue,
} from "../../../generated/graphql";
import { MapError } from "../../../util/MapError";
import { InputField } from "../../InputField";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  issue: UserIssue;
}

interface CommentProps {
  issueId: number;
  setScroll: React.Dispatch<React.SetStateAction<boolean>>;
}

// TOOD: Make own file
const Comment: React.FC<CommentProps> = ({ issueId, setScroll }) => {
  const { data, subscribeToMore } = useCommentsQuery({
    variables: { id: issueId },
    fetchPolicy: "network-only",
  });
  const { data: dataUser } = useUserQuery();

  React.useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SendCommentDocument,
      variables: { id: issueId },
      updateQuery: (prev, { subscriptionData }) => {
        const result = subscriptionData as any; // doesn't infer correct type for some reason

        return {
          ...prev,
          getCommentsForIssue: [
            ...prev.getCommentsForIssue,
            result.data.sendComment,
          ],
        };
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore, issueId]);

  React.useEffect(() => {
    if (data && data.getCommentsForIssue.length > 6) setScroll(true);
    else setScroll(false);
  }, [data, setScroll]);

  return (
    <Stack>
      {data &&
        dataUser &&
        dataUser.user &&
        data.getCommentsForIssue &&
        data.getCommentsForIssue.map((comment) => (
          <Flex
            flexDir="column"
            key={comment.id}
            align={
              dataUser.user!.id === comment.postedBy.id
                ? "flex-end"
                : "flex-start"
            }>
            <Flex
              align="center"
              flexDir={
                dataUser.user!.id === comment.postedBy.id
                  ? "row-reverse"
                  : "row"
              }>
              {dataUser.user!.id !== comment.postedBy.id && (
                <Avatar size="sm" mr={2} />
              )}
              <Flex>
                <Text fontSize={14} fontWeight="bold">
                  {comment.postedBy.name}
                </Text>
                <Text ml={2} fontSize={14} opacity={0.6}>
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </Text>
              </Flex>
            </Flex>
            <Text mt={1} fontSize={14}>
              {comment.comment}
            </Text>
          </Flex>
        ))}
    </Stack>
  );
};

// TODO: Just pass the issue as Props, don't fetch.
export const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, issue }) => {
  const { data: dataUser } = useUserQuery();
  const [createComment] = useCreateCommentMutation();
  const [scroll, setScroll] = React.useState<boolean>(false);

  return (
    <Box fontFamily="Poppins">
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "90%", md: "768px" }}
          p={4}
          fontFamily="Poppins">
          {dataUser && dataUser.user && (
            <Flex h="100%" flexDir="column" align="flex-start">
              <Box ml={6} py={6}>
                <Heading mr={2} size="md">
                  {issue.name}
                </Heading>
                <Text mt={1} opacity={0.7} mr={2} size="md">
                  {issue.desc}
                </Text>
              </Box>
              <Box ml={6} py={6}>
                <Heading mr={2} size="md">
                  Comments
                </Heading>
              </Box>
              <Box
                alignSelf="center"
                justifySelf="flex-end"
                p={4}
                w="60%"
                maxH={600}
                overflowY={scroll ? "scroll" : "hidden"}>
                <Comment issueId={issue.id} setScroll={setScroll} />

                <Formik
                  initialValues={{ content: "" }}
                  onSubmit={async (values, { setErrors, resetForm }) => {
                    const response = await createComment({
                      variables: {
                        issueId: issue.id,
                        content: values.content,
                      },
                    });
                    if (response.data!.createComment !== null) {
                      setErrors(MapError(response.data!.createComment!));
                    } else {
                      resetForm({
                        values: { content: "" },
                      });
                    }
                  }}>
                  {({ isSubmitting }) => (
                    <Form>
                      <Box mt={8}>
                        <InputField
                          area
                          name="content"
                          placeholder="Comment description..."
                        />
                      </Box>
                      <Button
                        background="#7209B7"
                        type="submit"
                        float="right"
                        borderRadius={10}
                        isLoading={isSubmitting}
                        my={4}
                        size="sm"
                        _hover={{
                          background: "#480972",
                        }}
                        color="#F8F9FA">
                        Comment
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Flex>
          )}
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Box>
  );
};
