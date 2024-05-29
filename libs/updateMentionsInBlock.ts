import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const getBlocks = async (blockId: string) => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
  });
  return response.results;
};

const updatePageMention = async (blockId: string, newID: string) => {
  const response = await notion.blocks.update({
    block_id: blockId,
    paragraph: {
      rich_text: [
        {
          type: "mention",
          mention: {
            //@ts-ignore
            type: "page",
            page: {
              id: newID,
            },
          },
        },
      ],
      color: "default",
    },
  });
  return response;
};

export const updateMentionsInBlock = async (newPageId: string) => {
  const dashboardBlockID = process.env.DASHBOARD_BLOCK_ID;
  if (!dashboardBlockID) throw new Error("env가 지정되지 않았습니다");
  const blocks = await getBlocks(dashboardBlockID);

  for (const block of blocks) {
    console.log(JSON.stringify(block, null, 4));

    if (
      //@ts-ignore
      block.type === "paragraph" &&
      //@ts-ignore
      block?.paragraph?.rich_text?.[0]?.type === "mention"
    ) {
      const blockId = block.id;
      await updatePageMention(blockId, newPageId);
      console.log("페이지 멘션 링크가 최신화되었습니다.");
    }
  }
};
