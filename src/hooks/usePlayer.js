"use client";

import useSWR from "swr";
import fetcher from "@/fetcher";

const usePlayer = osuid => {
   const { data, error, isLoading, mutate } = useSWR(
      `/api/db/player${osuid ? `?osuid=${osuid}` : ""}`,
      fetcher
   );

   return {
      data,
      isLoading,
      isError: error,
      mutate
   };
};
export default usePlayer;
