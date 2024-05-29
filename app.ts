import { addContentToPage, createWeekEntry } from "./libs/createWeeklyPage";
import {
  generateDayRange,
  getWeeklyPageTitle,
} from "./libs/getWeeklyPageTitle";
import { updateMentionsInBlock } from "./libs/updateMentionsInBlock";

const main = async () => {
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
