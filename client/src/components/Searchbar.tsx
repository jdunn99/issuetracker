import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  setQuery: (newValue: string) => void;
  placeholder: string;
  query: string;
}

export const Searchbar: React.FC<SearchProps> = ({
  query,
  setQuery,
  placeholder,
}) => {
  return (
    <InputGroup size="sm" maxW={450}>
      <InputLeftElement
        pointerEvents="none"
        children={<FaSearch style={{ fontSize: " 25px" }} />}
      />
      <Input
        onChange={(e) => setQuery(e.target.value)}
        borderRadius="none"
        _placeholder={{ color: "black" }}
        value={query}
        background="#f9f9f9"
        fontSize="14px"
        placeholder={`Search for ${placeholder}...`}
      />
    </InputGroup>
  );
};
