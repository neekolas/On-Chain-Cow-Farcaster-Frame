import type { NextApiRequest, NextApiResponse } from "next";

import { SyndicateClient } from "@syndicateio/syndicate-node";
import { validateFramesPost } from "@xmtp/frames-validator";
import { FramePostPayload } from "@xmtp/frames-validator/dist/src/types";

const syndicate = new SyndicateClient({
  token: () => {
    const apiKey = process.env.SYNDICATE_API_KEY;
    if (typeof apiKey === "undefined") {
      // If you receive this error, you need to define the SYNDICATE_API_KEY in
      // your Vercel environment variables. You can find the API key in your
      // Syndicate project settings under the "API Keys" tab.
      throw new Error(
        "SYNDICATE_API_KEY is not defined in environment variables."
      );
    }
    return apiKey;
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    try {
      console.log("req.body", req.body);
      // A full version of this would have auth, but we're not dealing with any
      // sensitive data or funds here. If you'd like, you could validate the
      // Farcaster signature here
      const fid = req.body.untrustedData.fid;
      const addressFromXmtp = await validateXmtpMessage(req.body);
      console.log(
        "Extracted address from FID passed to Syndicate: ",
        addressFromXmtp
      );
      // Mint the On-Chain Cow NFT. We're not passing in any arguments, since the
      // amount will always be 1
      const mintTx = await syndicate.transact.sendTransaction({
        projectId: "6babb5eb-d0b0-4a5a-adbd-9718ff26fdaa",
        contractAddress: "0xBeFD018F3864F5BBdE665D6dc553e012076A5d44",
        chainId: 84532,
        functionSignature: "mint(address to)",
        args: {
          // TODO: Change to the user's connected Farcaster address. This is going
          // to WillPapper.eth for now
          to: addressFromXmtp,
        },
      });
      console.log("Syndicate Transaction ID: ", mintTx.transactionId);

      res.status(200).setHeader("Content-Type", "text/html").send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta property="og:title" content="On-Chain Cow!" />
          <meta
            property="og:image"
            content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-happy-cow.png"
          />
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-happy-cow.png"
          />
          <meta
            property="fc:frame:button:1"
            content="Grow your on-chain pasture! Mint MORE COWS!"
          />
          <meta
            name="fc:frame:post_url"
            content="https://on-chain-cow-farcaster-frame.vercel.app/api/on-chain-cow-farcaster-frame"
          />
        </head>
      </html>
    `);
    } catch (error) {
      res.status(500).send(`Error: ${(error as any).message}`);
    }
  } else {
    // If the request is not a POST, we know that we're not dealing with a
    // Farcaster Frame button click. Therefore, we should send the Farcaster Frame
    // content
    res.status(200).setHeader("Content-Type", "text/html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content="On-Chain Cow!" />
        <meta
          property="og:image"
          content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-neutral-cow.png"
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-neutral-cow.png"
        />
        <meta property="fc:frame:button:1" content="How many On-Chain Cows can you mint?" />
        <meta
          name="fc:frame:post_url"
          content="https://on-chain-cow-farcaster-frame.vercel.app/api/on-chain-cow-farcaster-frame"
        />
      </head>
    </html>
    `);
  }
}

export async function validateXmtpMessage(body: FramePostPayload) {
  if (body.untrustedData.walletAddress) {
    const data = await validateFramesPost(body);
    return data?.verifiedWalletAddress;
  }
  throw new Error("No wallet address found in Farcaster Frame post");
}
