const BASE_URL = "https://on-chain-cow-farcaster-frame-lac.vercel.app/";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta property="of:accepts:xmtp" content="2024-02-01" />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content="On-Chain Cow!" />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="og:image"
          content={`${BASE_URL}/img/on-chain-cow-neutral-cow.png`}
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content={`${BASE_URL}/img/on-chain-cow-neutral-cow.png`}
        />
        <meta
          property="fc:frame:button:1"
          content="How many On-Chain Cows can you mint?"
        />
        <meta name="fc:frame:post_url" content={`${BASE_URL}/api/post`} />
      </Head>
    </>
  );
}
