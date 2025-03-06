import { PropsWithChildren } from "react";
import { Map } from "../../components/Map";
import { getAllCats } from "@/db/operations/getAllCats";
import { Markers } from "@/components/Markers";

type Props = PropsWithChildren & {
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: Props) {
  return (
    <Map>
      <Markers markers={getAllCats()} />
      {children}
      {modal}
    </Map>
  );
}
