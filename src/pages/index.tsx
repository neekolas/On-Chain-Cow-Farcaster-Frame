const BASE_URL = "https://on-chain-cow-farcaster-frame-lac.vercel.app/";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta property="of:accepts:xmtp" content="2024-02-01" />
        <meta property="og:title" content="On Chain Cow" />
        <meta property="og:image" content={`${BASE_URL}/question.jpg`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${BASE_URL}/question.jpg`} />
        <meta property="fc:frame:button:1" content="Yes" />
        <meta property="fc:frame:button:2" content="No" />
        <meta property="fc:frame:post_url" content={`${BASE_URL}/api/post`} />
      </Head>
    </>
  );
}
