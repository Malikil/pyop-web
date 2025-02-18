"use client";

import { toast } from "react-toastify";

export default function copyText(text) {
   navigator.clipboard.writeText(text);
   toast.success("Copied to clipboard!", { autoClose: 1000 });
}

export const copyTextE = e => copyText(e.target.value);
