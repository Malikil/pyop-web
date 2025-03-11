"use client";

import { approverAuth } from "@/server-actions/verifyRoles";
import useSWR from "swr";

export function useApproverAuth() {
   return useSWR("approverAuth", approverAuth);
}
