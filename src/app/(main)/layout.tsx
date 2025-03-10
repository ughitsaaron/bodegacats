'use server';

import { PropsWithChildren } from "react";
import { Map } from "../../components/Map";
import { getAllCats } from "@/db/operations/getAllCats";
import { Markers } from "@/components/Markers";


export default async function Layout(props: PropsWithChildren) {
  const markersPromise = getAllCats();
  return (
    <Map>
      <Markers markers={markersPromise as Promise<any>} />
      {props.children}
    </Map>
  )
}
