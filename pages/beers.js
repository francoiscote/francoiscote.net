import Head from "next/head";
import { beerItems } from "../components/Beers/BeerCard";

import { NavBar } from "../components/NavBar";
import { Title1 } from "../components/Typography";
import { BeerCard } from "../components/Beers/BeerCard";

const BREWFATHER_API_DOMAIN = "https://api.brewfather.app/v1";

// TODO: cache for rate-limit of 150 calls per hour on the API
export async function getServerSideProps(context) {
  const authString = Buffer.from(
    `${process.env.BREWFATHER_API_USER_ID}:${process.env.BREWFATHER_API_KEY}`
  ).toString("base64");

  const headers = {
    authorization: `Basic ${authString}`,
  };

  const includes = [
    "batchNotes",
    "batchFermentables",
    "batchHops",
    "batchYeasts",
    "bottlingDate",
    "estimatedColor",
    "estimatedIbu",
    "notes",
    "measuredAbv",
    "measuredBatchSize",
    "measuredFg",
    "measuredOg",
    "recipe.style.name",
    "status",
    "tasteRating",
  ];

  const res = await fetch(
    `${BREWFATHER_API_DOMAIN}/batches?include=${includes.join(",")}`,
    { headers }
  );
  const data = await res.json();

  if (!data) {
    return {
      norFound: true,
    };
  }

  return {
    props: {
      beers: [...data],
    },
  };
}

export default function BeersPage({ beers }) {
  console.log(beers);

  return (
    <>
      <Head>
        <title>Beers - francoiscote.net</title>
      </Head>

      <NavBar />

      <Title1> Beers</Title1>
      <ul role="list">
        {beers.map((b, i) => (
          <BeerCard key={`beer-${i}`} {...b} />
        ))}
      </ul>
    </>
  );
}
