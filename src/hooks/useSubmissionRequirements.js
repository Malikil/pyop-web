"use client";

import useSWR from "swr";
import { getRequirements } from "@/server-actions/mappools";

const useSubmissionRequirements = () => {
   const { data, error, isLoading } = useSWR("requirements", getRequirements);

   return {
      data,
      isLoading,
      isError: error
   };
};
export default useSubmissionRequirements;
