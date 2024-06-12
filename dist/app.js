var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// libs/createWeeklyPage.ts
var import_client = require("@notionhq/client");
var import_dayjs2 = __toESM(require("dayjs"));
var import_isoWeek2 = __toESM(require("dayjs/plugin/isoWeek"));
var import_customParseFormat2 = __toESM(require("dayjs/plugin/customParseFormat"));
var import_dotenv = __toESM(require("dotenv"));

// libs/getWeeklyPageTitle.ts
var import_dayjs = __toESM(require("dayjs"));
var import_isoWeek = __toESM(require("dayjs/plugin/isoWeek"));
var import_customParseFormat = __toESM(require("dayjs/plugin/customParseFormat"));
var import_ko = require("dayjs/locale/ko");
import_dayjs.default.extend(import_isoWeek.default);
import_dayjs.default.extend(import_customParseFormat.default);
import_dayjs.default.locale("ko");
var getWeekNumber = (date) => {
  return date.isoWeek();
};
var getWeekRange = (year, week) => {
  const startOfYear = (0, import_dayjs.default)(`${year}-01-01`);
  const startOfWeek = startOfYear.isoWeek(week).startOf("isoWeek");
  const endOfWeek = startOfWeek.endOf("isoWeek");
  return { start: startOfWeek, end: endOfWeek };
};
var today = (0, import_dayjs.default)();
var weekNumber = getWeekNumber(today);
var weekRange = getWeekRange(today.year(), weekNumber);
var getWeeklyPageTitle = () => {
  return {
    start: weekRange.start,
    end: weekRange.end,
    pageTitle: `${today.year()}\uB144 ${weekNumber}\uC8FC\uCC28 (${weekRange.start.format(
      "YYYY/MM/DD"
    )}~${weekRange.end.format("YYYY/MM/DD")})`
  };
};
var generateDayRange = (start, end) => {
  const dateFormat = "YYYY-MM-DD (dd)";
  const dateRange = [];
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    dateRange.push(current.format(dateFormat));
    current = current.add(1, "day");
  }
  return dateRange;
};

// libs/createWeeklyPage.ts
var import_path = __toESM(require("path"));
import_dotenv.default.config({ path: import_path.default.resolve(__dirname, ".env") });
import_dayjs2.default.extend(import_isoWeek2.default);
import_dayjs2.default.extend(import_customParseFormat2.default);
var notion = new import_client.Client({ auth: process.env.NOTION_API_KEY });
var weeklyDatabaseId = "a12710dc66c34148b1575689cea5b585";
var createWeekEntry = async () => {
  try {
    const newPage = await notion.pages.create({
      parent: { database_id: weeklyDatabaseId },
      properties: {
        \uC774\uB984: {
          title: [
            {
              text: {
                content: getWeeklyPageTitle().pageTitle
              }
            }
          ]
        }
      }
    });
    console.log(`Created new entry with ID: ${newPage.id}`);
    return newPage.id;
  } catch (error) {
    console.error("Error creating new entry: ", error);
    throw error;
  }
};
var addContentToPage = async (pageId, headers, firstRow) => {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Habit Tracker"
              }
            }
          ]
        }
      }
    ]
  });
  const rows = firstRow.map((v) => ({
    type: "table_row",
    table_row: {
      cells: [
        [{ text: { content: v } }],
        ...Array(headers.length - 1).fill(true).map(() => [{ text: { content: "" } }])
      ]
    }
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
                cells: headers.map((v) => [{ text: { content: v } }])
              }
            },
            ...rows
          ]
        }
      }
    ]
  });
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "TODO"
              }
            }
          ]
        }
      },
      {
        object: "block",
        type: "divider",
        divider: {}
      },
      {
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Task"
              }
            }
          ],
          checked: false
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: []
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "JOURNAL"
              }
            }
          ]
        }
      },
      {
        object: "block",
        type: "divider",
        divider: {}
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
                content: v
              }
            }
          ]
        }
      }))
    ]
  });
};

// libs/updateMentionsInBlock.ts
var import_client2 = require("@notionhq/client");
var dotenv2 = __toESM(require("dotenv"));
var import_path2 = __toESM(require("path"));
dotenv2.config({ path: import_path2.default.resolve(__dirname, ".env") });
var notion2 = new import_client2.Client({ auth: process.env.NOTION_API_KEY });
var getBlocks = async (blockId) => {
  const response = await notion2.blocks.children.list({
    block_id: blockId
  });
  return response.results;
};
var updatePageMention = async (blockId, newID) => {
  const response = await notion2.blocks.update({
    block_id: blockId,
    paragraph: {
      rich_text: [
        {
          type: "mention",
          mention: {
            //@ts-ignore
            type: "page",
            page: {
              id: newID
            }
          }
        }
      ],
      color: "default"
    }
  });
  return response;
};
var updateMentionsInBlock = async (newPageId) => {
  var _a, _b, _c;
  const dashboardBlockID = process.env.DASHBOARD_BLOCK_ID;
  if (!dashboardBlockID)
    throw new Error("env\uAC00 \uC9C0\uC815\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4");
  const blocks = await getBlocks(dashboardBlockID);
  for (const block of blocks) {
    console.log(JSON.stringify(block, null, 4));
    if (
      //@ts-ignore
      block.type === "paragraph" && //@ts-ignore
      ((_c = (_b = (_a = block == null ? void 0 : block.paragraph) == null ? void 0 : _a.rich_text) == null ? void 0 : _b[0]) == null ? void 0 : _c.type) === "mention"
    ) {
      const blockId = block.id;
      await updatePageMention(blockId, newPageId);
      console.log("\uD398\uC774\uC9C0 \uBA58\uC158 \uB9C1\uD06C\uAC00 \uCD5C\uC2E0\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    }
  }
};

// app.ts
var main = async () => {
  try {
    const newPageId = await createWeekEntry();
    const headers = JSON.parse(process.env.HEADER ?? "[]");
    const firstRow = generateDayRange(
      getWeeklyPageTitle().start,
      getWeeklyPageTitle().end
    );
    await addContentToPage(newPageId, headers, firstRow);
    await updateMentionsInBlock(newPageId);
  } catch (error) {
    console.error("Error in processing: ", error);
  }
};
main();
