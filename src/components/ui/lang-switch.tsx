// import { useTranslation } from "@/app/i18n";
// import { languages } from "@/app/i18n/settings";
// import Link from "next/link";
// import { Trans } from "react-i18next/TransWithoutContext";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "./button";

// export const LangSwitcher = async ({ lng }: { lng: string }) => {
//   const { t, i18n } = await useTranslation(lng);
//   return (
//     <div>
//       {/* <Trans i18nKey="languageSwitcher" t={t}>
//         Switch from <strong>{lng}</strong> to:{" "}
//       </Trans> */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" size="icon">
//             {lng.toUpperCase()}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           {languages
//             .filter((l) => lng !== l)
//             .map((l, index) => {
//               return (
//                 // <span key={l}>
//                 //   {index > 0 && " or "}
//                 //   <Link href={`/${l}`}>{l}</Link>
//                 // </span>
//                 <Link key={l} href={`/${l}`}>
//                   <DropdownMenuItem>{l}</DropdownMenuItem>
//                 </Link>
//               );
//             })}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

export {};
