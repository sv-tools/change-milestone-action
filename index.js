import { getInput, setFailed, setOutput } from "@actions/core";
import { context, getOctokit } from "@actions/github";

const states = ["open", "closed"];

async function run() {
  const octokit = getOctokit(getInput("token", { required: true }));
  const params = {};

  const state = getInput("state");
  if (state) {
    if (!states.includes(state)) {
      throw new Error(
        `invalid value of "state": "${state}", expected "open" or "closed"`,
      );
    }
    params["state"] = state;
  }

  const title = getInput("title");
  if (title) {
    params["title"] = title;
  }

  const description = getInput("description");
  if (description) {
    params["description"] = description;
  }

  const due_on = getInput("due_on");
  if (due_on) {
    if (isNaN(new Date(due_on).getTime())) {
      throw new Error(
        `invalid value of "due_on": "${due_on}", expected ISO 8601 format`,
      );
    }
    params["due_on"] = due_on;
  }

  const milestones = await octokit.rest.issues.listMilestones({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: "all",
  });

  const byID = getInput("by_id");
  const byNumber = getInput("by_number");
  const byTitle = getInput("by_title");
  let oldMilestone;
  let errorMessage;
  if (byID) {
    errorMessage = `by ID "${byID}"`;
    oldMilestone = milestones.data.find(
      (milestone) => milestone.id === parseInt(byID, 10),
    );
  } else if (byNumber) {
    errorMessage = `by Number "${byNumber}"`;
    oldMilestone = milestones.data.find(
      (milestone) => milestone.number === parseInt(byNumber, 10),
    );
  } else if (byTitle) {
    errorMessage = `by Title "${byTitle}"`;
    oldMilestone = milestones.data.find(
      (milestone) => milestone.title === byTitle,
    );
  } else {
    throw new Error(
      `unable to find any milestone, all search attributes are empty`,
    );
  }

  if (!oldMilestone) {
    throw new Error(`milestone ${errorMessage} not found`);
  }

  params["milestone_number"] = oldMilestone.number;
  params["owner"] = context.repo.owner;
  params["repo"] = context.repo.repo;
  const updatedMilestone = await octokit.rest.issues.updateMilestone(params);

  setMilestoneOutput(updatedMilestone.data);
}

function setMilestoneOutput(milestone) {
  setOutput("id", milestone.id);
  setOutput("number", milestone.number);
  setOutput("state", milestone.state);
  setOutput("description", milestone.description);
  setOutput("title", milestone.title);
  setOutput("due_on", milestone.due_on);
}

try {
  await run();
} catch (error) {
  setFailed(error.message);
}
