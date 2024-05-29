import { Client } from "@notionhq/client";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dotenv from "dotenv";
import { getWeeklyPageTitle } from "./getWeeklyPageTitle";

dotenv.config();
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const weeklyDatabaseId = "a12710dc66c34148b1575689cea5b585";

export const createWeekEntry = async (): Promise<string> => {
  try {
    const newPage = await notion.pages.create({
      parent: { database_id: weeklyDatabaseId },
      properties: {
        이름: {
          title: [
            {
              text: {
                content: getWeeklyPageTitle().pageTitle,
              },
            },
          ],
        },
      },
    });

    console.log(`Created new entry with ID: ${newPage.id}`);
    return newPage.id;
  } catch (error) {
    console.error("Error creating new entry: ", error);
    throw error;
  }
};

export const addContentToPage = async (
  pageId: string,
  headers: string[],
  firstRow: string[]
) => {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Habit Tracker (System 1)",
              },
            },
          ],
        },
      },
    ],
  });

  const rows: any = firstRow.map((v) => ({
    type: "table_row",
    table_row: {
      cells: [
        [{ text: { content: v } }],
        ...Array(headers.length - 1)
          .fill(true)
          .map(() => [{ text: { content: "" } }]),
      ],
    },
  }));

  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        type: "table",
        table: {
          table_width: 3,
          has_column_header: true,
          has_row_header: false,
          children: [
            {
              type: "table_row",
              table_row: {
                cells: headers.map((v) => [{ text: { content: v } }]),
              },
            },
            ...rows,
          ],
        },
      },
    ],
  });

  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "column_list",
        column_list: {
          children: [
            {
              object: "block",
              type: "column",
              column: {
                children: [
                  {
                    object: "block",
                    type: "heading_3",
                    heading_3: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: "TODO (System 2)",
                          },
                        },
                      ],
                    },
                  },
                  {
                    object: "block",
                    type: "to_do",
                    to_do: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: "Task",
                          },
                        },
                      ],
                      checked: false,
                    },
                  },
                ],
              },
            },
            {
              object: "block",
              type: "column",
              column: {
                children: [
                  {
                    object: "block",
                    type: "heading_3",
                    heading_3: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: "JOURNAL",
                          },
                        },
                      ],
                    },
                  },
                  //@ts-ignore
                  ...firstRow.map((v) => ({
                    object: "block",
                    type: "bulleted_list_item",
                    bulleted_list_item: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: v,
                          },
                        },
                      ],
                    },
                  })),
                ],
              },
            },
          ],
        },
      },
    ],
  });
};
