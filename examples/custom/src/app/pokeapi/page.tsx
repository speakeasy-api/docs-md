import { redirect, RedirectType } from "next/navigation";

export default function Page() {
  redirect("/pokeapi/api", RedirectType.replace);
}
