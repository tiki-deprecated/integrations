/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

const tiki = require("./tiki");

exports.handler = async function (event, context) {
  const rowMap = new Map();
  const rows = JSON.parse(event.body).data;

  const filters = {
    ptrs: [],
    tags: ["device_id"],
    // usecases: [],
    // destinations: [],
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const hashedPtr = tiki.hash(row[1]);

    filters.ptrs.push(hashedPtr);
    rowMap.set(hashedPtr, i);
    rows[i] = [row[0], false];
  }

  const token = await tiki.authorize();
  await pageAll(token, filters, (licenses) => {
    licenses.forEach((license) => {
      const rowId = rowMap.get(license.ptr);
      rows[rowId][1] = true;
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: rows,
    }),
  };
};

async function pageAll(token, filters, onResult, pageToken = undefined) {
  const res = await tiki.list(token, filters, pageToken);
  onResult(res.results);
  if (res.nextPageToken != null)
    await pageAll(token, filters, onResult, res.nextPageToken);
}
