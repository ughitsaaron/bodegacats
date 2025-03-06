import { PropsWithChildren } from "react";
import { Map } from "../../components/Map";
import { getAllCats } from "@/db/operations/getAllCats";
import { Markers } from "@/components/Markers";

type Props = PropsWithChildren & {
  upload: React.ReactNode;
};

export default async function Layout({ children, upload }: Props) {
  return (
    <Map>
      <Markers markers={getAllCats()} />
      {upload}
      {children}
    </Map>
  );
}
