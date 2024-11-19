import {useRouter} from "next/router";
import {USFlag} from "@/components/icons/flags/USFlag";
import {ESFlag} from "@/components/icons/flags/ESFlag";

const localeRTLList = ["ar","he"];
export function useIsRTL() {
  const {locale} = useRouter();
  if (locale && localeRTLList.includes(locale)) {
    return {isRTL: true,alignLeft: "right",alignRight: "left"};
  }
  return {isRTL: false,alignLeft: "left",alignRight: "right"};
}

export let languageMenu = [
  {
    id: "en",
    name: "English",
    value: "en",
    icon: <USFlag width="20px" height="15px" />,
  },
  {
    id: "es",
    name: "Español",
    value: "es",
    icon: <ESFlag width="20px" height="15px" />,
  },
];
