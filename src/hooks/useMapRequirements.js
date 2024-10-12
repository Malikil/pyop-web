"use client";

import useSWR from "swr";
import fetcher from "@/fetcher";

const useMapRequirements = () => {
   const { data, error, isLoading } = useSWR("/api/db/maps/requirements", fetcher);

   return {
      data,
      isLoading,
      isError: error
   };
};
export default useMapRequirements;
