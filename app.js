"use strict";

import { mermaidAPI } from "mermaid";

async function getJson(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

function getJobStatusById(data) {
  return new Map(data.map(jobStatus =>
    [jobStatus.url, jobStatus]));
}

function renderJobStatus(jobStatus) {
  const name = jobStatus.name.replace(/»/g, "->");
  const {
    status,
    progress,
    url
  } = jobStatus;

  return `<div class="job"><header class="job-name"><a href="${ url }">${ name }</a></header></div>`;
}

function buildGraph(jobs, jobStatusById) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUV".split("");
  const nodeIdByJobId = new Map();

  const getNode = jobId => {
    if (!nodeIdByJobId.has(jobId)) {
      const nodeId = alphabet.shift();
      nodeIdByJobId.set(jobId, nodeId);

      const statusHtml = renderJobStatus(jobStatusById.get(jobId));
      return `${ nodeId }(${ statusHtml })`;
    } else {
      return nodeIdByJobId.get(jobId);
    }
  }

  const jobGraphs = jobs.map(job => {
    const sourceNodeId = getNode(job.id);

    return job.children.map(childJob =>
      `${ sourceNodeId } --> ${ getNode(childJob) }`
    ).join("\n");
  }).join("\n");

  return `graph TD\n${ jobGraphs }`;
}

async function app() {
  const appNode = document.getElementById("app");

  const data = await getJson("data.json");
  const jobs = await getJson("jobs.json");

  const jobStatusesById = getJobStatusById(data.data);
  const graphCode = buildGraph(jobs, jobStatusesById);

  console.log(graphCode)
  const insertSvg = svg =>
    appNode.innerHTML = svg;

    mermaidAPI.render('app', graphCode, insertSvg);
  // mermaid.init(undefined, appNode);
  // mermaid.parse(graphCode);
};

window.addEventListener("load", app);

mermaidAPI.initialize({
  startOnLoad: false,
  flowChart: {
    htmlLabels: true
  }
});
